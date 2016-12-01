// root
const sRoot = 'HOMEWORK';

// dbo
const sDbo = 'dbo';
const sDb_acc = 'db_accessadmin';

// table
const sMember = 'MEMBER';
const sProfessor = 'PROFESSOR';
const sTa = 'TA';
const sStudent = 'STUDENT';
const sOrderMan = 'ORDER_MAN';
const sBook = 'BOOK';
const sAuthor = 'AUTHOR';
const sAuthorBook = 'AUTHOR_BOOK_LIST';
const sBookStore = 'BOOKSTORE';
const sBookStoreBook = 'BOOKSTORE_BOOK_LIST';
const sOrder = 'ORDER';
const sOrderBook = 'ORDER_BOOK_RECORD';

// memeber
const sAccount = 'account';
const sPassword = 'password';
const sName = 'name';
const sSsid = 'ssid';
const sEmail = 'email';
const sType = 'status';
const sQcount = 'qcount';
const initQcount = 0;

// PROFESSOR
const sProid = 'proid';
const sOffice = 'office';
const sGrade = 'grade';

// TA
const sTaid = 'taid';
const sRoom = 'room';

// STUDENT
const sSID = 'sid';
const sClass = 'class';

// ORDER_MAN
const sOrderManid = 'omid';

// BOOK
const sBookId = 'bookid';
const sBookName = 'bookname';
const sPrice = 'price';
const sPublisher = 'publisher';

// BOOKSTORE
const sBSID = 'bsid';
const sBSName = 'bsname';
const sCity = 'city';
const sBSPhone = 'bsphone';

// AUTHOR
const sAuthorId = 'authorid';
const sAuthorName = 'name';

// ORDER
const sOrderNo = 'orderno';
const sOrderTime = 'ordertime';
const sTotalPrice = 'total_price';

// ORDER_BOOK_RECORD
const sBookCount = 'book_count';

module.exports = {
    // root
    sRoot: sRoot,
    
    // dbo
    sDbo: sDbo,
    sDb_acc: sDb_acc,

    // table
    sMember:sMember,
    sProfessor: sProfessor,
    sTa: sTa,
    sStudent: sStudent,
    sOrderMan: sOrderMan,
    sBook: sBook,
    sAuthor: sAuthor,
    sAuthorBook: sAuthorBook,
    sBookStore: sBookStore,
    sBookStoreBook: sBookStoreBook,

    // memeber
    sAccount: sAccount,
    sPassword: sPassword,
    sName: sName,
    sSsid: sSsid,
    sEmail: sEmail,
    sType: sType,
    sQcount: sQcount,
    initQcount: initQcount,

    // PROFESSOR
    sProid: sProid,
    sOffice: sOffice,
    sGrade: sGrade,

    // TA
    sTaid: sTaid,
    sRoom: sRoom,

    // STUDENT
    sSID: sSID,
    sClass: sClass,

    // ORDER_MAN
    sOrderManid: sOrderManid,

    // BOOK
    sBookId: sBookId,
    sBookName: sBookName,
    sPrice: sPrice,
    sPublisher: sPublisher,

    // BOOKSTORE
    sBSID: sBSID,
    sBSName: sBSName,
    sCity: sCity,
    sBSPhone: sBSPhone,

    // AUTHOR
    sAuthorId: sAuthorId,
    sAuthorName: sAuthorName

}
