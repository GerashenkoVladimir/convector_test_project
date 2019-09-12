// // tslint:disable:no-unused-expression
// import { expect } from 'chai';
// import * as uuid from 'uuid/v4';
// import 'mocha';
//
// import { CouchDBStorage } from '@worldsibu/convector-storage-couchdb';
// import { FabricControllerAdapter } from '@worldsibu/convector-platform-fabric';
// import { BaseStorage, ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
//
// import { Participant, ParticipantController } from '../src';
//
// describe('Participant', () => {
//   let adapter: FabricControllerAdapter;
//   let participantCtrl: ConvectorControllerClient<ParticipantController>;
//
//   before(async () => {
//       adapter = new FabricControllerAdapter({
//         skipInit: true,
//         txTimeout: 300000,
//         user: 'user1',
//         channel: 'ch1',
//         chaincode: 'participant',
//         keyStore: '$HOME/hyperledger-fabric-network/.hfc-org1',
//         networkProfile: '$HOME/hyperledger-fabric-network/network-profiles/org1.network-profile.yaml',
//         userMspPath: '$HOME/hyperledger-fabric-network/artifacts/crypto-config/peerOrganizations/org1.hurley.lab/users/User1@org1.hurley.lab/msp',
//         userMsp: 'org1MSP'
//       });
//       participantCtrl = ClientFactory(ParticipantController, adapter);
//       await adapter.init(true);
//
//       BaseStorage.current = new CouchDBStorage({
//         host: 'localhost',
//         protocol: 'http',
//         port: '5084'
//       }, 'ch1_participant');
//   });
//
//   after(() => {
//     // Close the event listeners
//     adapter.close();
//   });
//
//   it('should create a default model', async () => {
//     const modelSample = new Participant({
//       id: uuid(),
//       name: 'Test',
//       created: Date.now(),
//       modified: Date.now()
//     });
//
//     await participantCtrl.create(modelSample);
//
//     const justSavedModel = await Participant.getOne(modelSample.id);
//     expect(justSavedModel.id).to.exist;
//   });
// });
