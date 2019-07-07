class Storage {
    constructor() { }
    get(name) {
      let value = localStorage.getItem(name);
      if (!value) {
        return null;
      }
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.log('123');
      }
      return value;
    }

    set(name, value) {
      localStorage.setItem(name, JSON.stringify(value));
    }

    getSession(name) {
      let value = sessionStorage.getItem(name);
      if (!value) {
        return null;
      }
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.log('123');
      }
      return value;
    }

    setSession(name, value) {
      sessionStorage.setItem(name, JSON.stringify(value));
    }

    remove(name) {
      localStorage.removeItem(name);
    }

    serialize(obj) {
      let query = '',
        // name,
        value,
        fullSubName,
        // subName,
        subValue,
        innerObj,
        i;
      for (const name in obj) {
        if (obj.hasOwnProperty(name)) {
        value = obj[name];
        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += this.serialize(innerObj) + '&';
          }
        } else if (value instanceof Object) {
          for (const subName in value) {
            if (value.hasOwnProperty(subName)) {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += this.serialize(innerObj) + '&';
            }
          }
        } else if (value !== undefined && value !== null) {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }
      }
      return query.length ? query.substr(0, query.length - 1) : query;
    }
}

export default new Storage();
