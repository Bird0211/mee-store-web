import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../user/auth.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
import { ProductForm, ProductVo, Result, Brands, Category } from '../../interface';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.less']
})
export class ItemEditComponent implements OnInit, OnChanges {

  @Input() isVisible: boolean;

  @Input() product: ProductVo;

  @Output() isVisibleChange: EventEmitter<boolean> = new EventEmitter();

  @Output() editItem: EventEmitter<ProductVo> = new EventEmitter();

  editProductUrl = null;

  productForm: FormGroup;

  selectedBrand: number;

  selectedSubCategory: number;

  selectedFreight: number;

  isShowUpdateButtn = true;

  fileList = [];

  isShelves = true;

  uploadUrl = null;

  productFreightUrl = null;

  loading = true;

  previewVisible = false;

  previewImage: string | undefined = '';


  constructor(private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService) {
      this.editProductUrl = environment.editProductUrl;
      this.uploadUrl = environment.uploadUrl;
      this.productFreightUrl = environment.productFreightUrl;
    }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.product !== undefined) {
      this.fileList = [];
      const newProduct:ProductVo = changes.product.currentValue;
      if(newProduct) {
        this.initProdcut(newProduct);
      }
    }
  }

  ngOnInit(): void {
    const prodcut: ProductVo = {
      id: null,
      name: null,
      description: null,
      image: null,
      brandId: 0,
      brandName: null,
      categoryId: 0,
      categoryName: null,
      status: 0,
      bizId: 0,
      freightId: 0
    };
    this.initProdcut(prodcut);
  }

  initProdcut(product: ProductVo) {
    this.productForm = this.fb.group({
      name: [product.name, [Validators.required]],
      description: [product.description, [Validators.required]],
      status: [product.status === 0, [Validators.required]],
      image: [product.image],
      brandName: [product.brandName],
      brandId: [product.brandId],
      categoryId: [product.categoryId],
      categoryName: [product.categoryName]
    });

    this.loadFreight();
    this.selectedBrand = product.brandId;
    this.selectedSubCategory = product.categoryId;
    if(product.image) {
      this.fileList = [...this.fileList,{
        uid: product.id,
        name: product.image.substring(product.image.lastIndexOf('/')+1,product.image.lastIndexOf('?')),
        status: 'done',
        url: product.image,
        thumbUrl: product.image
      }];
    }
  }

  closeEditProduct() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  removeProductImg = (file: UploadFile) => {
    this.isShowUpdateButtn = true;
    return true;
  }

  loadFreight() {
    if(this.product && this.product.id) {
      this.getFreight(this.product.id).subscribe((result: Result) => {
        if(result.statusCode === 0) {
          this.selectedFreight = result.data;
        }
      });
    }
  }

  getFreight(productId: number) {
    const url = this.productFreightUrl + '/' + productId;
    return this.http.get(url);
  }


  submitEditProduct() {
    const p: ProductForm = this.productForm.value;
    const product: ProductVo = {
      id: this.product.id,
      name: p.name,
      description: p.description,
      image: p.image.indexOf('/') > 0 ? p.image.substring(p.image.lastIndexOf('/') + 1, p.image.lastIndexOf('?')) : p.image,
      brandId: p.brandId,
      brandName: p.brandName,
      categoryId: p.categoryId,
      categoryName: p.categoryName,
      status: p.status ? 0 : 1,
      bizId: Number(this.authService.getBizId()),
      freightId: this.selectedFreight
    };

    this.loadEditProduct(product).subscribe((result: Result) => {
      this.isVisible = false;
      this.isVisibleChange.emit(this.isVisible);
      if (result.statusCode === 0) {
          this.message.success('更新成功!');
          const newProduct: ProductVo = result.data;
          console.log(newProduct);
          this.editItem.emit(newProduct);
      } else {
        this.message.error('更新失败!');
      }
    });

  }

  loadEditProduct(product: ProductVo) {
    const url = this.editProductUrl;
    return this.http.post(url, product);
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  handleProductChange(info: { file: UploadFile}): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        const meeResult: Result = info.file.response;
        if (meeResult.statusCode === 0) {
          const imgName = meeResult.data;
          this.productForm.patchValue({image: imgName});

          const defaultFile: UploadFile = {uid:'00000',name:'0000.jpg'};
          this.fileList.push(defaultFile);
          console.log(this.fileList)
          this.fileList = this.fileList.filter(item => item !== defaultFile);
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

  brandChange(brand: Brands) {
    this.productForm.patchValue({brandId: brand.id, brandName: brand.brandName});
  }

  categoryChange(subCategory: Category) {
    this.productForm.patchValue({categoryId: subCategory.id, categoryName: subCategory.name});
  }


}
