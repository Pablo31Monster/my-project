import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../../shared/models/book';
import { GetService } from '../../services/book/get/get.service';
import { UpdateService } from '../../services/book/update/update.service';
import { CreateService } from '../../services/book/create/create.service';
import { Category } from '../../../shared/models/category';
import { GetAllService } from '../../services/category/getAll/getAll.service';
import { GetAllService as GetAllTagService } from '../../services/tag/getAll/getAll.service';
import { DeleteService } from '../../services/category/delete/delete.service';
import { DeleteService as DeleteTagService } from '../../services/tag/delete/delete.service';
import { Tag } from '../../../shared/models/tag';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent {
  bookForm: FormGroup = new FormGroup({});
  categories: Category[] = [];
  tags: Tag[] = [];
  selectedTags: Tag[] = [];
  bookISBNInitial: string = "";
  errorMessage: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private getService: GetService,
    private updateService: UpdateService,
    private createService: CreateService,
    private getAllCategoriesService: GetAllService,
    private getAllTagsService: GetAllTagService,
    private deleteCatergoryService: DeleteService,
    private deleteTagService: DeleteTagService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ){}

  ngOnInit(){
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: ['', Validators.required],
      genre: ['', Validators.required],
      publicationDate: ['', Validators.required],
      publisher: ['', Validators.required],
      language: ['', Validators.required],
      description: ['', Validators.required],
      pageCount: ['', [Validators.required, Validators.min(1)]],
      coverImage: ['', Validators.required],
      format: ['', Validators.required],
      availability: ['', Validators.required],
      category: [null, ],
      averageRating: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      ratingCount: ['', [Validators.required, Validators.min(0)]],
      summary: ['', Validators.required]
    });

    this.bookISBNInitial = this.activatedRoute.snapshot.paramMap.get('isbn') || '';
    if (this.bookISBNInitial){
      this.getService.get(this.bookISBNInitial).subscribe((book) => {
        if(book){

          for (const tag of book.Tags){
            delete tag['BookTag'];
          }
          this.selectedTags = book.Tags;
          this.bookForm.patchValue(book);
        }
      })
    }

    this.updateCategories();
    this.updateTags();
  }

  deleteSelectedCategory() {
    if (!this.bookForm.value.category || this.bookForm.value.category === 'null') return;
    const data: Book = this.bookForm.value
    this.deleteCatergoryService.delete(data.category).subscribe(() => {
      this.getAllCategoriesService.getAll().subscribe((data) => {
        this.categories = data;
      });
    });
  }

  updateCategories() {
    this.getAllCategoriesService.getAll().subscribe((data) => {
      this.categories = data;
    })
  }

  updateTags() {
    this.getAllTagsService.getAll().subscribe((data) => {
      this.tags = data;
    })
  }

  isTagSelected(tag: Tag){
    const contains = this.selectedTags.filter((item) => item.id === tag.id)
    return contains.length > 0;
  }

  deleteSelectedTags() {
    if (!this.selectedTags || this.selectedTags.length <= 0) return;
    for (let tag of this.selectedTags){
      this.deleteTagService.delete(tag.id).subscribe(() => {

      });
    }
    this.getAllTagsService.getAll().subscribe((data) => {
      this.tags = data;
    });
  }

  onChangeTag(value: Tag) {
    let includes = false;
    for(const tag of this.selectedTags){
      if (tag.id === value.id){
        includes = true;
      }
    }

    if(includes) {
      this.selectedTags = this.selectedTags.filter((tag) => tag.id !== value.id)
    }else {
      this.selectedTags.push(value);
    }
  }

  getSelectedCategory(): number {
    if (!this.bookForm.value.category || this.bookForm.value.category === 'null') return -1;
    return this.bookForm.value.category;
  }

  onSubmit(){
    if(this.bookForm.valid){
      if (!this.bookForm.value.category || this.bookForm.value.category === 'null')
        this.bookForm.patchValue({category: null});
      let book: Book = this.bookForm.value;
      book.Tags = this.selectedTags;
      let isbn = this.activatedRoute.snapshot.paramMap.get('isbn');
      if(isbn){
        this.updateService.update(isbn, book).subscribe(() => {
          this.router.navigate(['/books'])
        })
      }else {
        this.createService.create(book).subscribe(() => {
          this.router.navigate(['/books'])
        })
      }
    } else {
      this.errorMessage = "Form is invalid"
    }
  }
}