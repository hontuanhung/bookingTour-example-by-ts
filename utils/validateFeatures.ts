class Validatetor {
  static isValidType(data: any, type: string) {
    if (Array.isArray(type)) {
      return data.every((el: any) => typeof el === type[0]);
    }
    return type && typeof data === type;
  }

  static isMatch(password: string, passwordConfirm: string) {
    return password === passwordConfirm ? true : false;
  }

  static isGreater(max: number, input: number) {
    return input <= max ? true : false;
  }

  static isLessThan(min: number, input: number) {
    return input >= min ? true : false;
  }

  static isValidEmail(email: string) {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  // static isNotEmpty(data) {
  //   data = data || null;
  //   return typeof data !== 'undefined' && data !== null;
  // }
}

export = Validatetor;
