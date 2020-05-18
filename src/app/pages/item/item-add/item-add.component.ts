import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductForm, ProductParamVo, Brands, Result, Category, ProductVo, Specification, Freight } from '../../interface';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { AuthService } from '../../user/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.less']
})
export class ItemAddComponent implements OnInit {

  @Input() isVisible: boolean;

  @Output() addItem: EventEmitter<ProductVo> = new EventEmitter();

  @Output() isVisibleChange: EventEmitter<boolean> = new EventEmitter();

  productForm: FormGroup;

  selectedBrand: number;

  selectedSubCategory: number;

  selectedFreight: number;

  specificationData: Specification[] = [];

  fileList = [];

  productAddUrl = null;

  loading = false;

  imageUrl = null;
  uploadUrl = null;

  isShowUpdateButtn = true;

  previewImage: string | undefined = '';
  previewVisible = false;

  spcloading = false;
  isShelves = true;

  imagesList: { [key: string]: any[]} = {};

  i = 0;

  editId: string | null;

  constructor(private message: NzMessageService,
            private authService: AuthService,
            private http: HttpClient,
            private fb: FormBuilder) {
              this.productAddUrl = environment.addProductUrl;
              this.imageUrl = environment.imageUrl;
              this.uploadUrl = environment.uploadUrl;
            }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      status: [null, [Validators.required]],
      image: [null],
      brandName: [null],
      brandId: [null],
      categoryId: [null],
      categoryName: [null]
    });
  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  addProduct() {
    const p: ProductForm = this.productForm.value;
    const product: ProductParamVo = {
      id: null,
      name: p.name,
      description: p.description,
      image: p.image,
      brandId: p.brandId,
      brandName: p.brandName,
      categoryId: p.categoryId,
      categoryName: p.categoryName,
      status: p.status ? 0 : 1,
      bizId: Number(this.authService.getBizId()),
      specifications: this.specificationData,
      freightId: this.selectedFreight
    };

    this.addProductData(product).subscribe((result: Result) => {
        if (result.statusCode === 0) {
            this.message.success('添加成功!');
            const pro: ProductParamVo = result.data;
            this.addItem.emit({
              id: pro.id,
              name: pro.name,
              description: pro.description,
              image: pro.image,
              categoryId: pro.categoryId,
              categoryName: pro.categoryName,
              status: pro.status,
              brandId: pro.brandId,
              brandName: pro.brandName,
              bizId: pro.bizId,
              freightId: pro.freightId
            });
            this.isVisible = false;
            this.isVisibleChange.emit(this.isVisible);
        } else {
          this.message.error('添加失败,请稍后再试');
        }
    });

  }

  addProductData(product: ProductParamVo) {
    const url = this.productAddUrl;
    return this.http.post(url, product);
  }

  handleProductChange(info: { file: UploadFile}) {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        const meeResult: Result = info.file.response;
        if (meeResult.statusCode === 0) {
          const imgName = meeResult.data;
          this.productForm.patchValue({image: imgName});
          info.file.thumbUrl = this.imageUrl + '/' + imgName;
          const fils = this.fileList[this.fileList.length -1];
          this.fileList = [fils];

          this.loading = false;
          this.isShowUpdateButtn = false;
        } else {
          this.message.error('上传失败！');
          this.loading = false;
        }
        break;
      case 'error':
        this.message.error('Network error');
        this.loading = false;
        break;
    }
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  handleSpecificationChange(info: { file: UploadFile }, tid: string): void {
    switch (info.file.status) {
      case 'uploading':
        this.spcloading = true;
        break;
      case 'done':
        const meeResult: Result = info.file.response;
        if (meeResult.statusCode === 0) {
          this.spcloading = false;
          const imgName = meeResult.data;
          this.specificationData.forEach(item => {
            if (item.tid === tid) {
              item.image = imgName;
            }
          });
          const fils = this.imagesList[tid][this.imagesList[tid].length -1];
          this.imagesList[tid] = [fils];
        }
        break;
      case 'error':
        this.message.error('Network error');
        this.spcloading = false;
        break;
    }
  }

  removeProductImg = (file: UploadFile) => {
    this.isShowUpdateButtn = true;
    return true;
  }

  addRow() {
    this.editId = `${this.i}`;
    this.specificationData = [
      ...this.specificationData,
      {
        id: null,
        name: '',
        productId: null,
        price: 0,
        weight: 0,
        barcode: '',
        number: 0,
        image: '',
        tid: this.editId
      }
    ];
    this.imagesList[this.editId] = [];
    this.i++;
  }

  removeSpecBtn = (file: UploadFile) => {
    const fileName = file.name;
    this.specificationData.filter( item => item.tid === file.uid).
          forEach( item => {
            item.image = null;
          });

    this.imagesList[file.uid] = [];
  }

  deleteRow(tid: string) {
    this.specificationData = this.specificationData.filter(d => d.tid !== tid);
  }

  startEdit(tid: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editId = tid;
  }

  brandChange(brand: Brands) {
    this.productForm.patchValue({brandId: brand.id, brandName: brand.brandName});
  }

  categoryChange(subCategory: Category) {
    this.productForm.patchValue({categoryId: subCategory.id, categoryName: subCategory.name});
  }

}
