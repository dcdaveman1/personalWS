// book class
class Book {
    constructor(title, author, rating, notes){
        this.title = title;
        this.author = author;
        this.rating = rating;
    }
}

// ui class
class UI {
    // static so we dont have to instantiate them
    static displayBooks() {
        
        const books = Store.getBooks();
 
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = '<td>' + book.title + '</td>' + 
        '<td>' + book.author + '</td>' + 
        '<td>' + book.rating + '</td>' + 
        '<td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>';

        list.appendChild(row);
    }

    static deleteBook(el) {
         if (el.classList.contains('delete')) {
             el.parentElement.parentElement.remove();
         }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = 'alert alert-' + className;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form);

        // vanish in 4 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#rating').value = '';
    }
}
// store class

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(author, title) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.author === author && book.title === title) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// event:display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// event: add book
document.querySelector('#book-form').addEventListener('submit', function (e) {
        //prevent actual submit
        e.preventDefault();
        // get form values
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const rating = document.querySelector('#rating').value;

        // validate if fields are completed
        if (title === '' || author === '' || rating === '') {
            UI.showAlert('Please complete all fields', 'danger');
        } else {
            //instantiate book
        const book = new Book(title, author, rating);
        console.log(book);

        // add book to list
        UI.addBookToList(book);

        // add book to store
        Store.addBook(book);

        // show success message
        UI.showAlert('Book added to collection', 'success');

        // clear fields
        UI.clearFields();
        }

       

    }
    );

// event:remove book
document.querySelector('#book-list').addEventListener('click', function(e) {
    // remove book from the UI
    UI.deleteBook(e.target);

    // remove book from storage
    const author = e.target.parentElement.previousElementSibling.previousElementSibling;
    Store.removeBook(author.textContent, author.previousElementSibling.textContent);

    UI.showAlert('Book removed', 'success');
});
