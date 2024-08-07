import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateService } from '../../services/category/create/create.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../shared/models/category';
import { GetService } from '../../../shared/services/category/get/get.service';
import { UpdateService } from '../../services/category/update/update.service';

@Component({
  selector: 'app-new-category-modal',
  templateUrl: './new-category-modal.component.html',
  styleUrl: './new-category-modal.component.css'
})
export class NewCategoryModalComponent implements OnInit {
  @Input() categoryId: number = -1;
  opened: boolean = false;
  creating: boolean = false;
  @Output() caterogyEvent = new EventEmitter<boolean>();
  categoryForm: FormGroup = new FormGroup({});
  errorMessage: string = "";

  constructor(
    private createCategoryService: CreateService,
    private getCategoryService: GetService,
    private updateCategoryService: UpdateService,
    private router: Router, private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  createCategory(): void {
    if(this.categoryForm.valid){
      this.errorMessage = "";
      const data: Category = this.categoryForm.value
      this.creating = true;
      this.createCategoryService.create(data).subscribe(() => {
        this.creating = false;
        this.caterogyEvent.emit(true);
        this.closeModal()
      });
    }else
      this.errorMessage = "Form invalid";
  }

  updateCategory(): void {
    if(this.categoryForm.valid){
      this.errorMessage = "";
      const data: Category = this.categoryForm.value
      this.creating = true;
      this.updateCategoryService.update(this.categoryId, data).subscribe(() => {
        this.creating = false;
        this.caterogyEvent.emit(true);
        this.closeModal()
      });
    }else
      this.errorMessage = "Form invalid";
  }

  openModal() {
    this.categoryForm.patchValue({name: '', description: ''});
    this.opened = true;
  }

  loadModal() {
    this.getCategoryService.get(this.categoryId).subscribe((category: Category) => {
      if(category){
        this.categoryForm.patchValue(category);
      }
    });
    this.opened = true;
  }

  closeModal() {
    this.opened = false
  }
}
