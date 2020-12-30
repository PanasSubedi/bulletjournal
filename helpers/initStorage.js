import { storeItem, retrieveItem } from './storage';

export default function initStorage(){

  retrieveItem('meta').then(meta => {
    if (meta===null || meta.lastInsertBulletID === undefined){
      storeItem('meta', {lastInsertBulletID: '0'});
      storeItem('bullets', []);
    }
  });

}
