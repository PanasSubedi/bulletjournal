import { storeItem, retrieveItem } from './storage';

export default function initStorage(){

  // check if meta is stored, if not, create meta and bullets variables in storage
  retrieveItem('meta').then(meta => {
    if (meta===null || meta.lastInsertBulletID === undefined){
      storeItem('meta', {lastInsertBulletID: '0'});
      storeItem('bullets', []);
    }
  });

}
