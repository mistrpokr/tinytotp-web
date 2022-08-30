import * as OTPAuth from "otpauth";
class Account {
  constructor(id, service, showKey = false) {
    this.id = id;
    this.service = service;
    this.key = new OTPAuth.Secret();
    this.showKey = showKey;

    this.totp = new OTPAuth.TOTP({
      label: service,
      secret: this.key,
    });

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

  get token() {
    return this.totp.generate();
  }
}

export default Account;
