import { Component } from '@angular/core';
import { UserService } from './user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'user-mngt';
  tableData: any;
  tableHeaders: any;
  orginalData: any;
  totalPages: number = 1;
  sizePerPage: number = 10;
  currentPage: number = 1;
  isFiltered: boolean | undefined;
  filteredData: any;
  noData: boolean | undefined;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUserList().subscribe((data: any) => {
      this.orginalData = data;
      this.totalPages = data.length;
      this.tableData = this.orginalData;
      this.tableHeaders = Object.keys(data[0]);
      this.loadTotalPages();
    });
  }

  filterData(event: any) {
    let filterValue = event.target.value;
    if (filterValue === '') {
      this.isFiltered = false;
      this.tableData = this.orginalData;
    } else {
      this.isFiltered = true;
      this.filteredData = this.orginalData.filter((data: any) => {
        let filter = false;
        for (let header of this.tableHeaders) {
          if (data[header].toString().includes(filterValue)) {
            filter = true;
          }
        }
        return filter;
      });
      this.tableData = this.filteredData;
    }
    if (this.tableData.length === 0) {
      this.noData = true;
      this.totalPages = 0;
      this.currentPage = 0;
    } else {
      this.noData = false;
    }
    this.loadTotalPages()
  }

  loadTotalPages() {
    this.totalPages = this.tableData.length <= 10 ? 1 : Math.floor(this.tableData.length / 10);
    this.currentPage = this.currentPage > this.totalPages || this.currentPage === 0 ? 1 : this.currentPage;
    this.paginateData();
  }

  paginateData() {
    let lIndex = this.currentPage * this.sizePerPage;
    let fIndex = lIndex - this.sizePerPage;
    if (this.isFiltered) {
      this.tableData = this.filteredData.slice(fIndex, lIndex);
    } else {
      this.tableData = this.orginalData.slice(fIndex, lIndex);
    }
  }

  changePage(action: string) {
    if (action === 'F') {
      this.currentPage = 1;
    } else if (action === 'L') {
      this.currentPage = this.totalPages
    } else if (action === 'P') {
      this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : 1;
    } else if (action === 'N') {
      this.currentPage = this.currentPage < this.totalPages ? this.currentPage + 1 : this.totalPages;
    }
    this.paginateData();
  }
}
