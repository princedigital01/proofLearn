use cardano/script_context.{ScriptContext}
use cardano/transaction.{OutputReference, Transaction}

// This validator just always succeeds no matter what
validator always_succeeds {
  mint(datum: Option<Data>, redeemer: Data, context: ScriptContext) {
    todo @"hi"
  }

  else(_) {
    fail
  }
}
