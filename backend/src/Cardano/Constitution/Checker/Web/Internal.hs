module Cardano.Constitution.Checker.Web.Internal where

import Text.HTML.QQ

-- import Text.Hamlet
import Language.Haskell.TH.Quote
import NeatInterpolation (text)

htmlF :: QuasiQuoter
htmlF = quoteFile html

textF :: QuasiQuoter
textF = quoteFile text
