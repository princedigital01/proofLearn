test course () { 
use aiken/crypto.{Blake2b_256, Hash}
use aiken/list
use aiken/transaction.{ScriptContext, Spend, find_input, find_output,OutputReference}
use cardano/address/credential.{VerificationKey}
use cardano/assets.{Value, lovelace_of,quantity_of}
 
// Course purchase validator
type CourseDatum {
  course_id: ByteArray,
  instructor: Hash<Blake2b_256, VerificationKey>,
  price: Int,
  student: Hash<Blake2b_256, VerificationKey>,
  purchased_at: Int,
  access_granted: Bool,
}

type CourseRedeemer {
  PurchaseCourse
  GrantAccess
  RefundCourse
}

validator course_purchase {
  spend(datum: CourseDatum, redeemer: CourseRedeemer, context: ScriptContext) -> Bool {
    expect Spend(OutputReference) = context.info
    expect Some(input) = find_input(context.transaction.inputs, OutputReference)
    
    when redeemer is {
      PurchaseCourse -> {
        // Verify payment amount matches course price
        let payment_value = lovelace_of(input.output.value)
        let course_price = datum.price
        
        // Check if payment is sufficient
        payment_value >= course_price && !datum.access_granted
      }
      
      GrantAccess -> {
        // Only instructor can grant access after payment
        let tx_signed_by_instructor = 
          list.has(context.transaction.extra_signatories, datum.instructor)
        
        tx_signed_by_instructor && datum.access_granted == False
          }             
          } 
          } 
}}