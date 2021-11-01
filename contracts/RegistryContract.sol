// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

import "./IRegistryContract.sol";

/**
 * @title ETH2 Private messaging registry contract
 * @notice The registry contract used by ETH2 validators to register in the private chat
 */
contract RegistryContract is IRegistryContract {
    /**
     * @notice Record the registration related parameters in the blockchain's logs and emit Registration event
     * @param pubkey A BLS12-381 public key of the ETH2 validator
     * @param idCommitment An identity commitment for the ETH2 validator for group membership
     * @param signature A BLS12-381 signature of the `idCommitment` signed by the ETH2 validator's private
     * key from which the `pubkey` is derived from
     */
    function register(
        bytes calldata pubkey,
        bytes calldata idCommitment,
        bytes calldata signature
    ) external override {
        require(pubkey.length == 48, "RegistryContract: invalid pubkey length");
        require(idCommitment.length == 32, "RegistryContract: invalid idCommitment length");
        require(signature.length == 96, "RegistryContract: invalid signature length");

        // Emit a registration event - the validity of the event to be processed offchain
        emit RegistrationEvent(pubkey, idCommitment, signature);
    }
}
