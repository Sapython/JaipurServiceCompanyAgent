import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
})
export class FileInputComponent implements OnInit {
  @Input() icon: string = 'cloud-upload';
  @Input() label: string = 'Upload File';
  @Input() accept: string = 'image/*';
  @Output() fileSelected: EventEmitter<File | undefined> = new EventEmitter<
    File | undefined
  >();
  constructor() {}
  imageFileObject: File | undefined;
  binaryImageData: string = '';
  ngOnInit() {}

  setImage(event: any) {
    console.log('File selected', event.target.files[0]);
    this.imageFileObject = event.target.files[0];
    if (this.imageFileObject) {
      this.fileSelected.emit(this.imageFileObject);
      let reader = new FileReader();
      reader.readAsDataURL(this.imageFileObject);
      reader.onload = (event: any) => {
        this.binaryImageData = event.target.result;
      };
      reader.onerror = (event: any) => {
        console.log('Error while reading file', event);
      };
    }
  }

  clearImage() {
    this.imageFileObject = undefined;
    this.binaryImageData = '';
    this.fileSelected.emit(undefined);
  }
}
