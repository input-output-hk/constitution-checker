# Architecture of the doc based on the Epic A/C

## Backend description

The backend service is built around one primary scope: to provide the prevalidation of any Cardano parameters change that a user prepares to submit on-chain. The guardrails verified for every parameter are those already embedded in the constitution on-chain contract and additional guardrails validated by the committee. The parameters' data type verification is not covered by the guardrails check but at the schema (JSON) level during the data exchange between the API and the consumer.

## Components

Conceptually, we can split the backend service into three main components:

- **Restful JSON API**: A regular HTTP/JSON interface for exchanging data with clients.
- **Proposal & Parameters Monitor**: A synchronization mechanism for keeping a cache of all past and current proposals and epoch parameters.
- **Guardrails Checker**: The core service for checking parameter values against the encoded guardrails.

![Untitled-2024-06-19-1219-6](https://github.com/input-output-hk/constitution-checker/assets/3176255/220b24ce-a02a-4874-bc74-a20e02a23cf1)

## Source code structure

The project produces two binary artifcats:

- main library (`./src`)
- executable (`./app`)
- tests (`./test`)

### Namespaces/Modules Descriptions

- `constitution-checker-backend` library
- `Cardano.Constitution.Checker.API` - Handlers and definition of the API structure
- `Cardano.Constitution.Checker.Blockfrost` - Customization and communication with the Blockfrost API
- `Cardano.Constitution.Checker.Params` - Generic parameters type definition and utilities
- `Cardano.Constitution.Checker.Params.Definition` -  Concrete parameter definitionsincluding their guardrails. Every parameter is defined separately in its own file in the `./src/Cardano/Constitution/Checker/Params/Definition` folder.

### API routes description

- Functional routes
  - `GET /current-values` - Retrieves the latest Cardano Parameter values (outputs a JSON object in the same shape expected as input by  `POST /parameters/proposal`)
  - `POST /parameters/proposal` - Checks the values provided by a parameters change proposal against all defined guardrails.
  - `POST /parameters/proposal/by-url` - Same as `POST /parameters/proposal` but exepects a URL where the JSON object can be found

- Swagger utility
- `GET /swagger-ui` - Swagger HTML iterface
- `GET /swagger-ui/swagger.json` - swagger.json file

## How to contribute

Anyone can provide their contributions in various sections, but there are three main areas to focus on:

### Guardrails

There are two types of parameter guardrail assertions, which are embedded directly into the parameter definition:

```haskell
data Assertion a
  = MustBe !(String, String) !(RangeConstraint a)
  | ShouldSatisfy !(String, String) !(Context -> a -> SatisfactionResult)
```

- Range constraints specify forbidden values.
- Custom assertions expect a pure function to determine if a value is valid/invalid or if no assumption is made. The function returns a `SatisfactionResult`

  ```haskell
    data SatisfactionResult
      = Satisfied
      | Unsatisfied !String
      | Neutral !String
  ```

To illustrate those two concepts, here is an illustration on `govActionLifetime`:

```haskell
govActionLifetime :: Param (Identity Integer)
govActionLifetime =
  Scalar @Integer
    29
    "govActionLifetime"
    [ ("GAL-01", "govActionLifetime must not be lower than 1 epoch (5 days)") `MustBe` NL 1
    , ("GAL-02", "govActionLifetime must not be greater than 15 epochs (75 days)") `MustBe` NG 15
    , ("GAL-05", "govActionLifetime must be less than dRepActivity")
        `ShouldSatisfy` \ctx val ->
          case ctx.merged.byName.getInteger "dRepActivity" of
            Just dRepActivity'
              | val < dRepActivity' -> Satisfied
              | otherwise -> Unsatisfied "govActionLifetime must be less than dRepActivity"
            Nothing -> Unsatisfied "dRepActivity not found"
    ]
```

- `Scalar @Integer` - specifies that the parameter type is a single value of Integer (Though we use Integer, the node will accept only 64-bit integers)
- `29` is the parameter ID.
- `govActionLifetime` -  is the name of the parameter.
- `GAL-01` -  is a range constraint specifying that the parameter value shouldn't be less than `1`
- `GAL-02` - is a range constraint specifying that the parameter value shouldn't be greater than `15`
- `GAL-05` -  is a custom assertion validating that `govActionLifetime` isn't greater or equal to `dRepActivity`:
  - The `dRepActivity` values is taken from the context
  - `ctx.merged.byName.getInteger "dRepActivity"` -  searches for the `dRepActivity` value first in the proposal, and if it's not found, it searches for the value in the current values of the node. This is done to verify this guardrail on the possible future state of the parameters if the proposal is adopted;

### Context

Through the context, we can pass additional information about the current and past state of the Cardano Blockchain to the custom guardrails. If needed, anyone can contribute to enriching the context with additional information.

The defition of the context is found in the `src/Cardano/Constitution/Checker/Params/Types`

```haskell
data Context = Context
  { proposal :: !ParamsAccess
  , merged :: !ParamsAccess
  , currentValues :: !ParamsAccess
  , latestEpoch :: !Epoch
  , valuesByEpoch :: !(Epoch -> ParamsAccess)
  }

data ParamsAccess = ParamsAccess
  { byName :: !(ByParameter String)
  , byIx :: !(ByParameter Integer)
  }
```

- `proposal` , `merged` and `currentValues` allow access to other parameter values within a `custom guardrail`.
  - `proposal` - Values provided in the same proposal.
  - `currentValues` - Parameter values in the latest epoch.
  - `merged` -  A merge between the first two. It searches first in the proposal, and if not found, tries in the `currentValues`.
- `latestEpoch` - The latest epoch.
- `valuesByEpoch` - Same as `currentValues` but for a specific `epoch`
- `ParamsAccess` -  A structure to allow parameter access by its name or based on its ID/ix.

### Tests

TBD
