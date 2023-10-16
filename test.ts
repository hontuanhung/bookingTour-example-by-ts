function Init(args: InitArguments) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      fuel = args.fuel || 0;
    };
  };
}

interface InitArguments {
  fuel: number;
}

class Rocket {
  fuel: number | undefined;
}

@Init({ fuel: 100 })
class Falcon9 extends Rocket {}

@Init({ fuel: 250 })
class Starship extends Rocket {}

const falcon = new Falcon9();
const starship = new Starship();

console.log(`Fueled Falcon9 with ${falcon.fuel}T.`);
//Fueled Falcon9 with 100T.

console.log(`Fueled Starship with ${starship.fuel}T.`);
//Fueled Starship with 250T.
