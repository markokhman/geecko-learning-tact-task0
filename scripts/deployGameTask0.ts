import { toNano } from 'ton-core';
import { GameTask0 } from '../wrappers/GameTask0';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const gameTask0 = provider.open(await GameTask0.fromInit());

    await gameTask0.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(gameTask0.address);

    // run methods on `gameTask0`
}
