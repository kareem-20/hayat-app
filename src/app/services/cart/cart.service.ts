import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
const ITEMS = 'items';
const FAV = 'fav';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private clear: boolean = false;
  items: any[] = [];
  totalPrice: number;
  clientPrice: number;
  cartCount: BehaviorSubject<number> = new BehaviorSubject(0);
  deliveryCost: number;

  public fav: any[] = [];
  constructor(private storage: Storage) {}

  async reloadCart() {
    this.items = (await this.storage.get(ITEMS)) || [];
    console.log('cart', this.items);
    const fav = await this.storage.get(FAV);
    fav == null ? (this.fav = []) : (this.fav = fav);
    this.cartCount.next(this.items.length);
  }

  updateCart(item: any) {
    let filter = this.items.filter((el) => el.ITEM_CODE == item.ITEM_CODE);
    item.QTY ? (filter[0].QTY = item.QTY) : this.deleteItem(item);
    this.saveStorage();
  }

  addItem(item: any) {
    if (!item.QTY) item.QTY = 1;
    this.items.push(item);
    this.saveStorage();
    console.log(this.items);
  }

  checkEachItem(item: any) {
    for (let p of this.items) {
      if (item._id == p._id) {
        item.QTY = p.QTY;
        return true;
      }
    }
  }
  getItemCart(item: any) {
    let filter = this.items.filter((p) => p._id == item._id);
    if (filter[0]) {
      // item.QTY = filter[0].QTY;
      item.addedToCart = true;
    }
  }
  checkEachSlide(slide: any) {
    let filter = this.items.filter((item) => item._id == slide?.product?._id);
    if (filter.length) return (slide.product.QTY = filter[0].QTY);
  }

  async deleteItem(item: any) {
    this.items = this.items.filter((i) => i.ITEM_CODE !== item.ITEM_CODE);
    await this.saveStorage();
  }

  private async saveStorage() {
    await this.storage.set(ITEMS, this.items);
    this.cartCount.next(this.items.length);
  }

  async clearCart() {
    this.items = [];
    await this.storage.set(ITEMS, []);
    this.cartCount.next(0);
  }

  get cartPrice() {
    return this.items.reduce((acc, el) => acc + el.price * el.QTY, 0);
  }

  get count() {
    return this.cartCount.asObservable();
  }

  toggleFav(item: any) {
    if (item?.favorite) {
      this.fav.push(item);
    } else {
      this.fav = this.fav.filter((f) => f._id != item._id);
    }
    return this.storage.set(FAV, this.fav);
  }
  getItemFavourit(item: any) {
    let filter = this.fav.filter((p) => p._id == item._id);
    if (filter[0]) {
      item.favorite = true;
    }
  }
}
