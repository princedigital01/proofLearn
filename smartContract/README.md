# prooflearn

Write validators in the `validators` folder, and supporting functions in the `lib` folder using `.ak` as a file extension.
 
```aiken
validator my_first_validator {
  spend(_datum: Option<Data>, _redeemer: Data, _output_reference: Data, _context: Data) {
    True
  }
}
```

## Building

```sh
aiken build
```

## Configuring

**aiken.toml**
```toml
[config.default]
network_id = 41
```

Or, alternatively, write conditional environment modules under `env`.

## Testing

You can write tests in any module using the `test` keyword. For example:

```aiken
use config

test foo() {
  config.network_id + 1 == 42
}
```

To run all tests, simply do:

```sh
aiken check
```

To run only tests matching the string `foo`, do:

```sh
aiken check -m foo
```

## Documentation

If you're writing a library, you might want to generate an HTML documentation for it.

Use:

```sh
aiken docs
```

All smart contracts will be written using **Aiken**, a modern and efficient smart contract language built for Cardano.

These contracts will power the core blockchain features of the ProofLearn platform.

---

### 🧾 1. Enrollment Validator

> 🔐 Ensures students are eligible before gaining course access.

- Verifies the student has paid the required course fee (in ADA or LEARN token)
- Validates the enrollment transaction on-chain
- Triggers course access in the backend after on-chain success
- Prevents double enrollments or replay attacks

---

### 🎖 2. Certificate NFT Validator

> 🎓 Mints tamper-proof, globally verifiable certificates.

- Mints a unique **NFT credential** after a student completes a course
- Uses the **CIP-68 standard** for updatable NFT metadata
- Certificate metadata includes:
  - Course title
  - Completion score
  - Student wallet address
  - Timestamp
- Proof of learning that lives on-chain, forever

---

### 💰 3. Escrow Logic Contract

> 🏦 Trustless payment between students and educators.

- Holds course payment in escrow at the time of enrollment
- Automatically releases funds to the educator on course completion
- Refund logic included (e.g. incomplete course or failed access)
- Adds trust and transparency without platform interference

