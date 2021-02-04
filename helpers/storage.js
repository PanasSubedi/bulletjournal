import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeItem = async(key, item) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.log(error.message);
  }
}

export const retrieveItem = async(key) => {
  try {
    const item = await AsyncStorage.getItem(key);
    return item !== null ? JSON.parse(item) : null;
  } catch (error) {
    console.log(error.message);
  }
}

export const retrieveBulletsByDate = async(dateStr) => {
  retrieveItem('bullets').then(bullets => {
    // check by dateStr (consistent date string format)
    dateBullets = bullets.filter(bullet => dateStr in bullet);
    if (dateBullets.length > 0){
      return dateBullets[0];
    }
    else {
      return [];
    }
  })
}

export const storeNewBullet = async(bullets, date) => {
  retrieveItem('bullets').then(prevBullets => {
    prevBullets[date] = bullets;
    storeItem('bullets', prevBullets);
  })
}
