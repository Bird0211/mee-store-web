import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Category, Result, SubCategoryVo } from '../interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../user/auth.service';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-category',
  templateUrl: './select-category.component.html',
  styleUrls: ['./select-category.component.less']
})
export class SelectCategoryComponent implements OnInit, OnChanges {

  @Input() selectedCategory: number;

  @Output() selectedCategoryChange: EventEmitter<number> = new EventEmitter();

  @Output() categoryChange: EventEmitter<Category> = new EventEmitter();

  category: number;

  categories: Category[];

  subCategories: Category[];

  isShowCategory = false;
  isShowSubCategory = false;

  newCategoryName: string;

  categoryListUrl = null;
  categoryUrl = null;
  categoryAddUrl = null;
  sameCategoryUrl = null;

  newSubCategoryName: string;

  loading = false;
  subLoading = false;

  constructor(private message: NzMessageService,
              private authService: AuthService,
              private http: HttpClient) {
                this.categoryListUrl = environment.queryCategoryUrl;
                this.categoryUrl = environment.getCategoryUrl;
                this.categoryAddUrl = environment.addCategoryUrl;
                this.sameCategoryUrl = environment.sameCategoryUrl;
              }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.categories || this.categories.length <= 0) {
      this.initCategories();
    }

    if(this.selectedCategory !== undefined && this.selectedCategory != null && this.selectedCategory !== 0) {
      if(this.subCategories === undefined ||
              this.subCategories.length <= 0 ||
              this.subCategories.filter(item => item.id === this.selectedCategory).length <= 0) {
        this.loadSameLevelCategory(this.selectedCategory);
      }
    }
  }

  ngOnInit(): void {

  }

  change(value: number) {
    if (value) {
      this.subLoading = true;
      this.selectedCategory = null;
      this.loadSubCategories(value);
    }
  }

  initCategories() {
    const pid = 0;
    this.loading = true;
    this.loadCategories(pid).subscribe((result: Result) => {
      this.loading = false;
      if (result.statusCode === 0) {
        this.categories = result.data;
      }
    });
  }


  loadSubCategories(value: number) {
    this.loadCategories(value).subscribe((result: Result) => {
      this.subLoading = false;
      if (result.statusCode === 0) {
        this.subCategories = result.data;
      }
    });
  }

  loadCategories(pid: number) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    };

    const body = 'categoryId=' + pid;
    const bizId = this.authService.getBizId();
    return this.http.post(this.categoryListUrl + '/' + bizId, body, httpOptions);
  }

  loadCategoryById(id: number) {
    const bizId = this.authService.getBizId();
    const url = this.categoryUrl + '/' + id + '/' + bizId;
    return this.http.get(url);
  }

  loadSameLevelCategory(categoryId: number) {
    this.getSameLevelCategory(categoryId).subscribe((result: Result) => {
        if(result.statusCode === 0) {
          const subCategories: SubCategoryVo =  result.data;
          this.category = subCategories.pid;
          this.subCategories = subCategories.category;
        }
    });
  }

  getSameLevelCategory(categoryId: number) {
    const url = this.sameCategoryUrl+'/'+categoryId;
    return this.http.get(url);
  }

  addCategory() {
    if (!this.newCategoryName || this.newCategoryName == null) {
      this.message.error('请输入类别名称！');
      return ;
    }

    this.addCategoryData(this.newCategoryName, 0).subscribe((result: Result) => {
      if (result.statusCode === 0) {
        const category: Category = result.data;
        if (category == null) {
           this.message.error('添加失败！');
        } else {
          this.categories.push(category);
          this.isShowCategory = false;
        }
      }
    });
  }

  addCategoryData(categoryName: string, categoryId: number) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
    };

    const body = 'categoryName=' + categoryName + '&categoryId=' + categoryId;
    return this.http.post(this.categoryAddUrl + '/' + this.authService.getBizId(), body, httpOptions);
  }

  addSubCategory() {
    if (!this.selectedCategory || this.selectedCategory == null) {
      this.message.error('请选择一级类别！');
      return ;
    }

    this.addCategoryData(this.newSubCategoryName, this.selectedCategory).subscribe((result: Result) => {
      if (result.statusCode === 0) {
        const category: Category = result.data;
        if (category == null) {
           this.message.error('添加失败！');
        } else {
          this.subCategories.push(category);
          this.isShowSubCategory = false;
        }
      } else {
        this.message.error('添加失败！');
      }
    });
  }

  addCategoryItem() {
    this.isShowCategory = true;
  }

  addSubCategoryItem() {
    this.isShowSubCategory = true;
  }

  openCategory(isOpen: boolean) {
    if (!isOpen) {
      this.isShowCategory = false;
    } else {
      if(!this.categories || this.categories.length <= 0) {
        this.initCategories();
      }
    }
  }

  openSubCategory(isOpen: boolean) {
    if (!isOpen) {
      this.isShowSubCategory = false;
    }
  }


  getCategoryName(categoryId: number): string {
    for (const category of this.categories) {
        if (category.id === categoryId) {
            return category.name;
        }
    }
  }

  getSubCategoryName(categoryId: number) {
    for (const category of this.subCategories) {
      if (category.id === categoryId) {
          return category.name;
      }
    }
  }

  subCategoryChange(value: number) {
    this.selectedCategoryChange.emit(value);
    const subCategory: Category = this.subCategories.filter(item => item.id === value)[0];
    this.categoryChange.emit(subCategory);
  }

}
