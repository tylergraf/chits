const fetch = function(url, config){
  let defaultConfig = {
    headers: {
      'content-type': 'application/json'
    }
  };

  Object.assign(defaultConfig,config)

  return window.fetch(url, defaultConfig).then(res=>{if (res.status !== 204 && res.status < 400) return res.json()});
}

export {fetch};
