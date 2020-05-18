import {EventEmitter } from '@angular/core';

export interface Result {
    statusCode: number;
    description: string;
    data: any;
}

export interface Category {
    id: number;
    name: string;
    pid: number;
}

export interface SubCategoryVo {
    pid: number;
    category: Category[];
}

export interface Brands {
    id: number;
    brandName: string;
}

export interface ProductParam {
    key?: string;

    name?: string;

    brandId?: number;

    categoryId?: number;

    pageNo: number;

    pageRows: number;
}

export interface ProductList {
    total: number;

    pages: number;

    pageNo: number;

    pageRows: number;

    products: ProductVo[];
}

export interface ProductParamVo {
    id: number;

    name: string;

    description: string;

    image: string;

    brandId: number;

    brandName: string;

    categoryId: number;

    categoryName: string;

    status: number;

    bizId: number;

    freightId: number;

    specifications?: Specification[] | null;
}

export interface ProductVo {
    id: number;

    name: string;

    description: string;

    image: string;

    brandId: number;

    brandName: string;

    categoryId: number;

    categoryName: string;

    status: number;

    bizId: number;

    freightId: number;
}

export interface Specification {
    id: number;

    productId: number;

    name: string;

    price: number;

    weight: number;

    barcode: string;

    number: number;

    image: string;

    tid?: string | null;
}

export interface ProductForm {
    id: number;
    name: string;
    description: string;
    image: string;
    brandId: number;
    brandName: string;
    categoryId: number;
    categoryName: string;
    status: boolean;
}

export interface SelectProducts {
    productId: number;
    productName: string;
    image: string;
    specificationId: number;
    specificationName: string;
    barcode: string;
    price: number;
    weight: number;
}

export interface OrderDetail {
    id?: number | null;

    orderId?: number | null;

    productId: number;

    productName: string;

    specId: number;

    specName: string;

    number: number;

    price: number;

    image: string;

    weight: number;

    total?: number;

    barcode?: string;
}

export interface OrderParamVo {
    id: number | null;

    userId: number | null;

    status: number;

    createTime: Date | null;

    payTime: Date | null;

    bizId: number;

    totalPrice: number;

    remark: string | null;

    orderDetails: OrderDetail[];
}

export interface Order {
    id: number | null;

    userId: number | null;

    status: number;

    createTime: Date | null;

    payTime: Date | null;

    bizId: number;

    totalPrice: number;

    remark: string | null;
}

export interface OrderList {
    total: number;

    pages: number;

    pageNo: number;

    pageSize: number;

    orders: OrderParamVo[]
}

export interface LoginData {
    business: string;
    userName: string;
    password: string;
    remember: boolean;
}

export interface AuthVo {
     bizId: number;

     userId: number;

     token: number;
}

export interface StepInfo {
    title: string;
    subTitle: string;
    status: string | 'wait' | 'process' | 'finish' | 'error';
    description: string;
    disabled: boolean;
    isShow: boolean | true | false;
}

export interface OrderStepComponent {
    data: any;
    callback: EventEmitter<any>;
}

export interface OrderAddress {
    id: number;

    orderId: number;

    city: string;

    street: string;

    firstName: string;

    lastName: string;

    phone: string;

    postcode: string;

    email: string;

    suburb: string;
}

export interface OrderQuery {
    startCreateDate: Date;

    endCreateDate: Date;

    startPayDate: Date;

    endPayDate: Date;

    orderSatus: number;

    userId: number;

    pageSize: number;

    pageIndex: number;

    bizId: number;
}

export interface Freight {
    id: number;
    bizId: number;
    name: string;
    type: number;
}

export interface FeightDetail {
    id: number;
    freightId: number;
    citys: string;
    first: number;
    firstPrice: number;
    more: number;
    morePrice: number;
    freeShipping: number;
    freeType: number;
    tid: string;
}

export interface FreightVo {
    freight: Freight;
    freightDetail: FeightDetail[];
}

export interface City {
    id: number;

    city: string;

    suburb?: string;

    checked: boolean | false;
}

export interface Suburb {
    suburb: string;

    checked: boolean | false;
}

export interface FeeVo {
    totalFee: number;
    feeDetail: FeeDetailVo[];
}

export interface FeeDetailVo {
    feeType: number;
    fee: number;
}

export interface PayMethod {
    methodCode: number;
    methodName: string;
}

export interface OrderPayVo {
    orderPay: OrderPay[];
    payDetails: PayDetail[];
    payTime?: Date;
}

export interface OrderPay {
    id: number ;

    payCode: number;

    payCodeName?: number;

    payPrice: number;

    orderId: number;

    reference: string;

    payNo: number;
}

export interface PayDetail {
    id: number;

    orderId: number;

    feeType: number;

    feeTypeName?: string;

    price: number;
}

export interface ExpressCompany {
    code: string;
    name: string;
}

export interface PartialDelivery {
    express: OrderExpress;
    expressDetails: OrderExpressDetail[];
}

export interface OrderExpress {
    id: number;

    orderId: number;

    expressCode: string;

    expressName: string;

    /**
     * 0：全部发货；2:拆单
     */
    type: number;

    expressCompanyName?: string;
}

export interface OrderExpressDetail {
    id: number;

    expressId: number;

    orderDetail: number;

    number: number;
}