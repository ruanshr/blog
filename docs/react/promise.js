const PENDING = "pending";
const FULFILLED = "fulilled";
const REJECTED = "REJECTED";

class MyPromise {
  constructor(callback) {
    this._status = "pending";
    this._value = undefined;
    callback(this._resolve.bind(this), this._reject.bind(this))
  }
  _changeStatus(status, data) {
    if (this.status !== "pending") {
      return ;
    }
    this._status = status;
    this._value = data;
  }
  _resolve(data) {
    this.status = "fulfilled"
    this._value = data
  }

  _reject(reason) {
    this._status = "rejected"
    this._value = reason
  }

  then(resolve, reject) {
    const status = this.status;
    if (status === "pending") {
      this.taskList.push({ resolve, reject })
    } else if (status === "rejected") {
      
    }
  }
}