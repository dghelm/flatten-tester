const skynetNode = require("@skynetlabs/skynet-nodejs");

const chalk = require("chalk");

// // Full site build
// const buildPath = "./build"
// const correctSkylink = "sia://AACnKwvDh6j3VwNmvnRGpxq-tQ2_JLcXZV2FFXwCp2HREA";


// small-build site (should have black background)
const buildPath = "./small-build"
const correctSkylink = "sia://AABal7NyB-nDPKWDqjkiZepv6L3L0RmJyWLAmi6i7O5uqA";
// //windows: 
// const correctSkylink = "sia://AADLuAmVvoY6p36OgpGchacyoY_l585_bvbKEtbcUmes7w";

const servers = [
  'https://eu-ger-1.siasky.net',
  'https://eu-ger-2.siasky.net',
  'https://eu-ger-5.siasky.net',
  'https://eu-ger-7.siasky.net',
  'https://eu-ger-8.siasky.net',
  'https://eu-ger-9.siasky.net',
  'https://eu-ger-10.siasky.net',
  'https://eu-ger-11.siasky.net',
  'https://eu-ger-12.siasky.net',
  'https://eu-pol-4.siasky.net',
  'https://eu-fin-4.siasky.net',
  'https://eu-fin-5.siasky.net',
  'https://eu-fin-6.siasky.net',
  'https://eu-fin-7.siasky.net',
  'https://eu-fin-8.siasky.net',
  'https://eu-fin-9.siasky.net',
  'https://eu-fin-10.siasky.net',
]


const pushDirectoryToSkynet = async (path, nodeClient) => {
  try {
    const response = await nodeClient.uploadDirectory(path);
    return response;
  } catch (e) {
    return {};
  }
};

const deployAll = async () => {

  let iterations = 3;
  let successes = 0;
  for (let index = 0; index < (servers.length * iterations); index++) {
    let choice = Math.floor(index / iterations);
    successes += await deploy(servers[choice]);
  }

    const failures = (iterations * servers.length) - successes;

    console.log(` ✅ successes: ${chalk.green(successes)}`);
    console.log(` ❌ failures: ${chalk.red(failures)}`);

}

const deploy = async (server) => {
// Create clients for upload and resolver skylink.
  let nodeClient = new skynetNode.SkynetClient(server);

  console.log(`🛰  ${server}...`);
  let skylink = await pushDirectoryToSkynet(buildPath, nodeClient);

  if (!skylink) {
    console.log(`📡 App deployment failed`);
    return false;
  }

  if ( skylink !== correctSkylink) {
    console.log(` ❌ App deployed flattened skylink: ${chalk.red(skylink)}`);
    return 0;

  } else {
    console.log(` ✅ App deployed correct skylink: ${chalk.green(skylink)}`);
    return 1;
  }
};

deployAll();
