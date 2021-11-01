// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

/**
 * @title ETH2 Private messaging registry contract's interface
 * @notice Interface for the registry contract, used by ETH2 validators to register in the private chat
 */
interface IRegistryContract {
    /**
    @notice A processed registration event
     */
    event RegistrationEvent(bytes indexed pubkey, bytes indexed idCommitment, bytes signature);

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
    ) external;
}
