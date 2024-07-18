class Product {
    constructor(name, description, price, quantity) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.editIndex = -1;
        this.init();
    }

    init() {
        this.form = document.getElementById('crudForm');
        this.productName = document.getElementById('productName');
        this.productDescription = document.getElementById('productDescription');
        this.productPrice = document.getElementById('productPrice');
        this.productQuantity = document.getElementById('productQuantity');
        this.submitButton = document.getElementById('submitButton');
        this.clearButton = document.getElementById('clearButton');
        this.warningMessage = document.getElementById('warningMessage');
        this.dataTable = document.getElementById('dataTable');
        this.tbody = this.dataTable.querySelector('tbody');

        this.form.addEventListener('submit', (event) => this.handleSubmit(event));
        this.clearButton.addEventListener('click', () => this.clearForm());

        this.checkDataAvailability();
    }

    handleSubmit(event) {
        event.preventDefault();
        const name = this.productName.value.trim();
        const description = this.productDescription.value.trim();
        const price = this.productPrice.value.trim();
        const quantity = this.productQuantity.value.trim();

        if (!this.validateInputs(name, description, price, quantity)) {
            alert('All fields must be filled correctly!');
            return;
        }

        const productData = new Product(name, description, price, quantity);

        if (this.editIndex === -1) {
            this.addProduct(productData);
        } else {
            this.updateProduct(productData);
        }
        this.clearForm();
        this.checkDataAvailability();
    }

    validateInputs(name, description, price, quantity) {
        const nameValid = /^[a-zA-Z0-9\s]+$/.test(name);
        const descriptionValid = description !== '';
        const priceValid = !isNaN(price) && parseFloat(price) > 0;
        const quantityValid = !isNaN(quantity) && parseInt(quantity) > 0;

        return nameValid && descriptionValid && priceValid && quantityValid;
    }

    addProduct(productData) {
        this.products.push(productData);
        this.renderTable();
    }

    updateProduct(productData) {
        this.products[this.editIndex] = productData;
        this.editIndex = -1;
        this.submitButton.textContent = 'Create';
        this.renderTable();
    }

    deleteProduct(index) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.products.splice(index, 1);
                this.renderTable();
                this.checkDataAvailability();
                Swal.fire('Deleted!', 'Your data has been deleted.', 'success');
            }
        });
    }

    renderTable() {
        this.tbody.innerHTML = '';
        this.products.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>${product.quantity}</td>
                <td>
                    <button class="editButton">Edit</button>
                    <button class="deleteButton">Delete</button>
                </td>
            `;
            this.attachRowEventListeners(row, index);
            this.tbody.appendChild(row);
        });
    }

    attachRowEventListeners(row, index) {
        row.querySelector('.editButton').addEventListener('click', () => this.editProduct(index));
        row.querySelector('.deleteButton').addEventListener('click', () => this.deleteProduct(index));
    }

    editProduct(index) {
        const product = this.products[index];
        this.productName.value = product.name;
        this.productDescription.value = product.description;
        this.productPrice.value = product.price;
        this.productQuantity.value = product.quantity;
        this.editIndex = index;
        this.submitButton.textContent = 'Update';
    }

    clearForm() {
        this.productName.value = '';
        this.productDescription.value = '';
        this.productPrice.value = '';
        this.productQuantity.value = '';
        this.editIndex = -1;
        this.submitButton.textContent = 'Create';
    }

    checkDataAvailability() {
        if (this.products.length === 0) {
            this.warningMessage.classList.remove('hidden');
            this.dataTable.classList.add('hidden');
        } else {
            this.warningMessage.classList.add('hidden');
            this.dataTable.classList.remove('hidden');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new ProductManager());
