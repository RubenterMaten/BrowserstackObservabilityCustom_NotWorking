import { remote, RemoteOptions } from 'webdriverio';

const serviceProjectName = `Boilerplate Project`;
const serviceBuildName = `Standard build`;
const serviceBuildTag = `Tagging`;

const testProject = `Temp Project`;
const testBuild = `START TIME: ${Date.now().toLocaleString()} Customized Run`;
const testName = `Customized Run - ${Date.now().toLocaleString()}`;
const testAppUrl = ``;          // Needs a valid Browserstack App url (bs://). The app used for this run can be found in the 'apps' folder or on https://github.com/webdriverio/native-demo-app/releases

const browserstackUser = '';    // Needs any valid browserstack user
const browserstackKey = '';     // Needs users key

export default class RunManager{
    async start(){
        const config = await this.getDriverConfiguration();
        const driver = await this.getDriver(config);
        
        try{
            await this.doAction(driver);
            await this.setBrowserstackSessionStatus(driver, testName, 'passed', '');
        }
        catch(err: any){
            await this.setBrowserstackSessionStatus(driver, testName, 'failed', err.message);
        }
        
        await this.printSource(driver);
        await this.closeDriver(driver);
    }

    async getDriverConfiguration(){
        console.log();
        console.log(`Preparing configuration...`);
        let config = {
            services: [
                ['browserstack', {
                    testObservability: true,
                    testObservabilityOptions: {
                        projectName: serviceProjectName,
                        buildName: serviceBuildName,
                        buildTag: serviceBuildTag
                    },
                }]
            ],
            user: browserstackUser,
            key: browserstackKey,
            capabilities: {
                platformName: 'android',
                os_version: '11.0',
                device: 'Google Pixel 5',
                project: testProject,
                build: testBuild,
                name: testName,
                app: testAppUrl,
                realMobile: true,
                newCommandTimeout: 240,
            }
        };
        
        console.log();
        return config;
    }

    async getDriver(options: any){
        console.log(`Loading driver...`);
        const driver = await remote(options as RemoteOptions);
        console.log();
        return driver;
    }

    async doAction(driver: WebdriverIO.Browser){
        console.log(`Clicking button "Swipe"...`);
        const element = await driver.$('//*[@text="Swipe"]');
        console.log();
        await element.click();
    }

    async printSource(driver: WebdriverIO.Browser){
        console.log(`Printing source...`);
        console.log();
        const source = await driver.getPageSource();
        console.log(source);
        console.log();
    }

    async setBrowserstackSessionStatus(driver: WebdriverIO.Browser, testName: string, status: string, reason: string){
        try {
            console.log();
            const args = [''];
                    
            let script = `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"${status}","reason":"${reason}"}}`;
            script = script.replace('\r\n', '. ');

            console.log(`Setting test status for ${testName} in Browserstack to ${status}.`);
            console.log(`Using script:\ ${script}`);
            await driver.executeScript(script, args);
        }
        catch (ex: any) {
            console.log(`WARNING: Could not set test status in browserstack. Error ${ex.message}`);
        }
    }

    async closeDriver(driver: WebdriverIO.Browser){
        console.log(`Closing session...`);
        await driver.deleteSession();
        console.log();

        console.log(`Driver closed.`);
        console.log();
    }
}
