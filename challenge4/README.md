# Challenge 4 - Compare break & HelloWorld implementation

> Task1: Find the differences between the way transactions are created in [the Hello World example](./helloworld/src/client/hello_world.ts) vs [the Break example](./break/client/src/providers/transactions/create.tsx).

* Break use a custom worker `workerRPC.createTransaction()`

* HelloWorld use `Transaction` class and `sendAndConfirmTransaction()` method from @solana/web3.js package

> Task2: Explore the accounts being used in the repository as well and create a brief - short write-up with your observations.

* Break example use several accounts.

* HelloWorld use only the `GreetingAccount`
