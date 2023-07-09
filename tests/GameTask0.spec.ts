import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { fromNano, toNano } from 'ton-core';
import { GameTask0 } from '../wrappers/GameTask0';
import '@ton-community/test-utils';

describe('GameTask0', () => {
    let blockchain: Blockchain;
    let gameTask0: SandboxContract<GameTask0>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        gameTask0 = blockchain.openContract(await GameTask0.fromInit());

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await gameTask0.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: gameTask0.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and gameTask0 are ready to use
    });

    it('should increase counter by 1', async () => {
        const increaser = await blockchain.treasury('increaser');
        const counterBefore = await gameTask0.getCounter();

        const increaseResult = await gameTask0.send(
            increaser.getSender(),
            {
                value: toNano('0.05'),
            },
            'increment'
        );

        expect(increaseResult.transactions).toHaveTransaction({
            from: increaser.address,
            to: gameTask0.address,
            success: true,
        });

        const counterAfter = await gameTask0.getCounter();

        expect(counterAfter).toBe(counterBefore + 1n);
    });
});
