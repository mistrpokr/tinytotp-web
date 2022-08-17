class Account {
  constructor(id, service, key, showKey = false) {
    this.id = id;
    this.service = service;
    this.key = key;
    this.showKey = showKey;

    // console.log(this.id, this.service, this.key, this.showKey);
  }

  setService(service) {
    this.service = service;
  }

  setKey(key) {
    this.key = key;
  }

  toggleShowKey() {
    this.showKey = !this.showKey;
  }
}

export default Account;
