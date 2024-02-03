export function getEnv() {
    let envLocation = window.location.origin;
    let ENDPOINT = 'https://swastha.health.gov.lk/';
    let CLOUD_KEYLOCAK = 'https://swastha.health.gov.lk/auth/';
    let cloud_Client_Secret = '1m3UcUsPAe3jjs8jmu79zDoZcc1RX01H';
    let cloud_client_id = 'SwasthaClient';

    switch (envLocation) {
        case "http://localhost:3000":
            //  return {
            //     KEYCLOAK_CLIENT_SECRET: 'uH0LDwsP09lXULXFoS9QvnsY1vpFSSat',
            //     KEYCLOAK_CLIENT_ID: 'SwasthaClient',
            //     PRINT_URL: 'https://swastha.health.gov.lk/SwasthaPrint/',
            //     ENDPOINT: 'http://ec2-3-132-15-192.us-east-2.compute.amazonaws.com:32582/',
            //     ENDPOINT_CLOUD:ENDPOINT,
            //     KEYCLOAK: 'http://ec2-3-132-15-192.us-east-2.compute.amazonaws.com:31551/auth/',
            //     KEYCLOAK_CLOUD:CLOUD_KEYLOCAK,
            //     CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
            //     CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            // } 

            return {
                KEYCLOAK_CLIENT_SECRET: 'aIZ0zRkWoHhwh0VDQpDDRh4zLGmKfRDs',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://20.84.115.205/SwasthaPrint/',
                ENDPOINT: 'http://20.84.115.205/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://20.84.115.205/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            } 
            /*   return {
                KEYCLOAK_CLIENT_SECRET: 'uH0LDwsP09lXULXFoS9QvnsY1vpFSSat',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'https://swastha.health.gov.lk/SwasthaPrint/',
                ENDPOINT: 'http://20.55.38.108/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://20.55.38.108/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }        */

            /*   return {
              KEYCLOAK_CLIENT_SECRET: '1m3UcUsPAe3jjs8jmu79zDoZcc1RX01H',
              KEYCLOAK_CLIENT_ID: 'SwasthaClient',
              PRINT_URL: 'http://124.43.176.48/SwasthaPrint/',
              ENDPOINT: 'http://124.43.176.48/',
              ENDPOINT_CLOUD: ENDPOINT,
              KEYCLOAK: 'http://124.43.176.48/auth/',
              KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
              CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
              CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
          }     */

            /*  return {
                KEYCLOAK_CLIENT_SECRET: '1m3UcUsPAe3jjs8jmu79zDoZcc1RX01H',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://124.43.176.48/SwasthaPrint/',
                ENDPOINT: 'http://124.43.176.48/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://124.43.176.48/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }  */
             /*   return {
                 KEYCLOAK_CLIENT_SECRET: '1m3UcUsPAe3jjs8jmu79zDoZcc1RX01H',
                 KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                 PRINT_URL: 'https://swastha.health.gov.lk/SwasthaPrint/',
                 ENDPOINT: 'https://swastha.health.gov.lk/',
                 ENDPOINT_CLOUD: ENDPOINT,
                 KEYCLOAK: 'https://swastha.health.gov.lk/auth/',
                 KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                 CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                 CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
             }   */
            break;
        case "http://ec2-3-132-15-192.us-east-2.compute.amazonaws.com:30584"://AWS Server
            return {
                KEYCLOAK_CLIENT_SECRET: 'uH0LDwsP09lXULXFoS9QvnsY1vpFSSat',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'https://swastha.health.gov.lk/SwasthaPrint/',
                ENDPOINT: 'http://ec2-3-132-15-192.us-east-2.compute.amazonaws.com:32582/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://ec2-3-132-15-192.us-east-2.compute.amazonaws.com:31551/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break;
        case "http://124.43.176.48"://SLT server
            return {
                KEYCLOAK_CLIENT_SECRET: '1m3UcUsPAe3jjs8jmu79zDoZcc1RX01H',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://124.43.176.48/SwasthaPrint/',
                ENDPOINT: 'http://124.43.176.48/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://124.43.176.48/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break;

        case "https://swastha.health.gov.lk"://SLT server
            return {
                KEYCLOAK_CLIENT_SECRET: '1m3UcUsPAe3jjs8jmu79zDoZcc1RX01H',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'https://swastha.health.gov.lk/SwasthaPrint/',
                ENDPOINT: 'https://swastha.health.gov.lk/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'https://swastha.health.gov.lk/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break;
        case "http://swastha.health.gov.lk"://SLT server
            return {
                KEYCLOAK_CLIENT_SECRET: '1m3UcUsPAe3jjs8jmu79zDoZcc1RX01H',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://swastha.health.gov.lk/SwasthaPrint/',
                ENDPOINT: 'http://swastha.health.gov.lk/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://swastha.health.gov.lk/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break;
        case "https://swastha.health.gov.lk"://SLT server
            return {
                KEYCLOAK_CLIENT_SECRET: '1m3UcUsPAe3jjs8jmu79zDoZcc1RX01H',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'https://swastha.health.gov.lk/SwasthaPrint/',
                ENDPOINT: 'https://swastha.health.gov.lk/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'https://swastha.health.gov.lk/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break;
        case "http://www.swastha.health.gov.lk"://SLT server
            return {
                KEYCLOAK_CLIENT_SECRET: '1m3UcUsPAe3jjs8jmu79zDoZcc1RX01H',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://www.swastha.health.gov.lk/SwasthaPrint/',
                ENDPOINT: 'http://www.swastha.health.gov.lk/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://www.swastha.health.gov.lk/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break;
        case "https://www.swastha.health.gov.lk"://SLT server
            return {
                KEYCLOAK_CLIENT_SECRET: '1m3UcUsPAe3jjs8jmu79zDoZcc1RX01H',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'https://www.swastha.health.gov.lk/SwasthaPrint/',
                ENDPOINT: 'https://www.swastha.health.gov.lk/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'https://www.swastha.health.gov.lk/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break;
        case "http://124.43.132.108"://SLT server new ip
            return {
                KEYCLOAK_CLIENT_SECRET: '1m3UcUsPAe3jjs8jmu79zDoZcc1RX01H',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://124.43.132.108/SwasthaPrint/',
                ENDPOINT: 'http://124.43.132.108/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://124.43.132.108/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break;
        case "http://172.16.6.88"://Kandy 1
            return {
                KEYCLOAK_CLIENT_SECRET: '9oRdiyHIM9xwwXLrIIimsPPqI7PGv07y',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://172.16.6.88/SwasthaPrint/',
                ENDPOINT: 'http://172.16.6.88/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://172.16.6.88/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break;
        case "http://172.16.6.89"://Kandy 2
            return {
                KEYCLOAK_CLIENT_SECRET: '9oRdiyHIM9xwwXLrIIimsPPqI7PGv07y',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://172.16.6.89/SwasthaPrint/',
                ENDPOINT: 'http://172.16.6.89/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://172.16.6.89/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break;


        case "http://20.55.38.108"://asues testing
            return {
                KEYCLOAK_CLIENT_SECRET: 'uH0LDwsP09lXULXFoS9QvnsY1vpFSSat',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://20.55.38.108/SwasthaPrint/',
                ENDPOINT: 'http://20.55.38.108/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://20.55.38.108/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break

        case "http://20.84.115.205"://asues trainig
            return {
                KEYCLOAK_CLIENT_SECRET: 'aIZ0zRkWoHhwh0VDQpDDRh4zLGmKfRDs',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://20.84.115.205/SwasthaPrint/',
                ENDPOINT: 'http://20.84.115.205/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://20.84.115.205/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break







        case "http://192.168.10.11"://HOSPITAL 1 gala

            return {
                KEYCLOAK_CLIENT_SECRET: 'EbXrcJGAJS69FYGwLVzJBayLsPkshsyd',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://192.168.10.11/SwasthaPrint/',
                ENDPOINT: 'http://192.168.10.11/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://192.168.10.11/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break;

        case "http://192.168.20.11"://HOSPITAL 2 katu
            return {
                KEYCLOAK_CLIENT_SECRET: 'EbXrcJGAJS69FYGwLVzJBayLsPkshsyd',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://192.168.20.11/SwasthaPrint/',
                ENDPOINT: 'http://192.168.20.11/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://192.168.20.11/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break;



        case "http://192.168.50.13"://HOSPITAL 3 mani
            return {
                KEYCLOAK_CLIENT_SECRET: 'EbXrcJGAJS69FYGwLVzJBayLsPkshsyd',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://192.168.50.13/SwasthaPrint/',
                ENDPOINT: 'http://192.168.50.13/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://192.168.50.13/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break
        case "http://192.168.30.10"://HOSPITAL 4 Thit
            return {
                KEYCLOAK_CLIENT_SECRET: 'EbXrcJGAJS69FYGwLVzJBayLsPkshsyd',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://192.168.30.10/SwasthaPrint/',
                ENDPOINT: 'http://192.168.30.10/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://192.168.30.10/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break
        case "http://192.168.40.10"://HOSPITAL 5 Wath
            return {
                KEYCLOAK_CLIENT_SECRET: 'EbXrcJGAJS69FYGwLVzJBayLsPkshsyd',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://192.168.40.10/SwasthaPrint/',
                ENDPOINT: 'http://192.168.40.10/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://192.168.40.10/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break
        case "http://10.1.1.29"://HOSPITAL Jafna
            return {
                KEYCLOAK_CLIENT_SECRET: 'EbXrcJGAJS69FYGwLVzJBayLsPkshsyd',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://10.1.1.29/SwasthaPrint/',
                ENDPOINT: 'http://10.1.1.29/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://10.1.1.29/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break

        case "http://192.168.122.197"://HOSPITAL mathale
            return {
                KEYCLOAK_CLIENT_SECRET: 'imFxMW4JoHrdkmyLBiJMlbmzSLnU9Nmd',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://192.168.122.197/SwasthaPrint/',
                ENDPOINT: 'http://192.168.122.197/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://192.168.122.197/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break
        case "http://192.168.1.250"://HOSPITAL mathale2
            return {
                KEYCLOAK_CLIENT_SECRET: 'imFxMW4JoHrdkmyLBiJMlbmzSLnU9Nmd',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: 'http://192.168.1.250/SwasthaPrint/',
                ENDPOINT: 'http://192.168.1.250/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: 'http://192.168.1.250/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break

        default:
            return {
                KEYCLOAK_CLIENT_SECRET: '9oRdiyHIM9xwwXLrIIimsPPqI7PGv07y',
                KEYCLOAK_CLIENT_ID: 'SwasthaClient',
                PRINT_URL: envLocation + '/SwasthaPrint/',
                ENDPOINT: envLocation + '/',
                ENDPOINT_CLOUD: ENDPOINT,
                KEYCLOAK: envLocation + '/auth/',
                KEYCLOAK_CLOUD: CLOUD_KEYLOCAK,
                CLOUD_KEYCLOAK_CLIENT_SECRET: cloud_Client_Secret,
                CLOUD_KEYCLOAK_CLIENT_ID: cloud_client_id,
            }
            break

        // code block
    }
}