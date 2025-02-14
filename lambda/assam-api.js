/// AWS Lambda: assam-api
/// this works around CORS issues
/// Note: NO automated deployment at this time
/// https://640264234305-o2elkm5e.us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/assam-api?newFunction=true&subtab=url&tab=code

/// https://yo2fkzmf2rh33u2b3bi3xhtqyi0toyqz.lambda-url.us-east-1.on.aws/?url={url}
/// see: https://assam.tea.xyz/api-docs

export const handler = async (event) => {
  const targetUrl = event.queryStringParameters?.url;
  
  const response = await fetch('https://assam.tea.xyz/api/v2' + targetUrl, {
    headers: {
      'Origin': 'https://assam.tea.xyz',
      'Accept': 'application/json'
    }
  });
  
  const data = await response.json();
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://pkgx.dev',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
};