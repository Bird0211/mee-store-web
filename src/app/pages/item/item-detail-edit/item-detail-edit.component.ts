import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductForm, ProductVo, Result, Brands, Category, Specification } from '../../interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../user/auth.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-item-detail-edit',
  templateUrl: './item-detail-edit.component.html',
  styleUrls: ['./item-detail-edit.component.less']
})
export class ItemDetailEditComponent implements OnInit, OnChanges {

  @Input() isVisible : boolean;

  @Output() isVisibleChange: EventEmitter<boolean> = new EventEmitter();

  @Input() productId: number;

  editSpecificationUrl = null;

  specificationData: Specification[] = [];

  delSpecificationUrl = null;

  i = 0;

  editId: string | null;

  uploadUrl = null;

  imagesList: { [key: string]: any[]} = {};

  loadingSpec = false;

  querySpecificationUrl = null;

  previewImage: string | undefined = '';
  previewVisible = false;

  spcloading = false;

  imageUrl = null;

  constructor(private http: HttpClient,
              private fb: FormBuilder,
              private authService: AuthService,
              private message: NzMessageService) {
                this.delSpecificationUrl = environment.delSpecificationUrl;
                this.querySpecificationUrl = environment.querySpecificationUrl;
                this.editSpecificationUrl = environment.editSpecificationUrl;
                this.imageUrl = environment.imageUrl;
                this.uploadUrl = environment.uploadUrl;
              }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.productId && changes.productId.currentValue && changes.productId.currentValue !== 0) {
      this.loadData(this.productId);
    }
  }

  ngOnInit(): void {

  }

  closeEditSpecification() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  submitEditSpecification() {
    this.loadEditSpecification().subscribe((result: Result) => {
      if (result.statusCode === 0) {
        this.message.success('更新成功!');
        this.isVisible = false;
        this.isVisibleChange.emit(this.isVisible);
      } else {
        this.message.error('更新失败!');
      }
    });
  }

  loadEditSpecification() {
    const url = this.editSpecificationUrl + '/' + this.productId;
    const data = this.specificationData;
    data.forEach(item => {
      item.image = item.image.indexOf('/') > 0 ?
      (item.image.substring(item.image.lastIndexOf('/') + 1, item.image.lastIndexOf('?'))) :
      item.image;
      }
    );

    return this.http.post(url, data);
  }

  addRow() {
    this.editId = `${this.i}`;
    this.specificationData = [
      ...this.specificationData,
      {
        id: null,
        name: '',
        productId: this.productId,
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

  deleteRow(tid: string) {
    this.specificationData = this.specificationData.filter(d => d.tid !== tid);
  }

  startEdit(tid: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editId = tid;
  }

  removeSpecBtn = (file: UploadFile) => {
    const fileName = file.name;
    this.specificationData.filter( item => item.tid === file.uid).
          forEach( item => {
            item.image = null;
          });

    this.imagesList[file.uid] = [];
  }

  loadData(prodcutId: number) {
    this.loadingSpecData(prodcutId).then((specs: Specification[]) => {
      specs.forEach(item => {
        if (!item.tid) {
          item.tid = item.id.toString();
        }
        let imgName = item.image;
        if (item.image.indexOf('/') > 0) {
          imgName = item.image.substring(item.image.lastIndexOf('/') + 1, item.image.lastIndexOf('?'));
        }
        this.imagesList[item.tid] = [];

        if (imgName && imgName.length > 0) {
          this.imagesList[item.tid].push(
            {
              uid: item.tid,
              name: imgName,
              status: 'done',
              url: item.image
            });
        }
      });
    });
}

/**
delSpec(specificationId: number) {
  this.deleteSpecData(specificationId).subscribe((result: Result) => {
    if (result.statusCode === 0) {
      this.specificationData.filter(d => d.id !== specificationId);
      this.message.success('删除成功!');
    } else {
      this.message.error('删除失败!');
    }
  });
}
 
deleteSpecData(specificationId: number) {
  const url = this.delSpecificationUrl + '/' + specificationId;
  return this.http.delete(url);
}
*/
loadingSpecData(productId: number) {
  const p = new Promise((resolve, reject) => {
    this.getSpecData(productId).subscribe((result: Result) => {
      this.loadingSpec = false;
      if (result.statusCode === 0) {
        this.specificationData = result.data;
        resolve(result.data);
      } else {
        reject(false);
      }
    });
  });

  return p;
}

getSpecData(productId: number) {
  const url = this.querySpecificationUrl + '/' + productId;
  return this.http.get(url);
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

}
