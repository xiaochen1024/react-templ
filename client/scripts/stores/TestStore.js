import { observable, action, computed } from "mobx";

export default class TestStore {
  @observable
  count = 1;

  @action
  add = async params => {
    this.count += 1;
  };
}
