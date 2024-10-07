const imageMap = {
    'white-tesla.png': require('../assets/cars/white-tesla.png'),
    'black-toyota.png': require('../assets/cars/black-toyota.png'),
    'gray-toyota.png': require('../assets/cars/gray-toyota.png'),
    'red-bmw.png': require('../assets/cars/red-bmw.png'),
    'blue-bmw.png': require('../assets/cars/blue-bmw.png'),
    'black-audi.png': require('../assets/cars/black-audi.png'),
    'blue-honda.png': require('../assets/cars/blue-honda.png'),
    'green-mini.png': require('../assets/cars/green-mini.png'),
    'black-land-rover.png': require('../assets/cars/black-land-rover.png'),
    'blue-jeep.png': require('../assets/cars/blue-jeep.png'),
    'black-bmw.png': require('../assets/cars/black-bmw.png'),
    'black-noah-toyota.png': require('../assets/cars/black-noah-toyota.png'),
    'blue-ford.png': require('../assets/cars/blue-ford.png'),
    'silver-bmw.png': require('../assets/cars/silver-bmw.png'),
};

export const getImage = (imageName: string) => {
    return imageMap[imageName] || require('../assets/cars/silver-bmw.png'); // Fallback image
};