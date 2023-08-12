## Hosted Project
[ابلكيشن اغسلي](https://play.google.com/store/apps/details?id=com.carwasher.washing_app)


#### Setup Basic Express Server

- import express and assign to variable
- setup start port variable (1812) and start function

## Usega
APIs build to the backend for an application specifically designed for lawyers, offering various features such as add personal information about the lawyer, their experiences, specializations, qualifications, and the ability to add videos, news or questions, community feature with real time interaction between users and chat feature allowing communication between the lawyer and the user.

## :bulb: Built Using

- MongoDB
- Express
- Node.JS
- Javascript
- jsonwebtoken for authentication and authorization
- fcm-node

### To Install all the dependencies

```
npm install
```
### Start API

```
npm start
```

## Routes

### Authentication
```
POST    registration    /api/v1/auth/signup
POST    login   /api/v1/auth/login
POST    reset password   /api/v1/auth/resetPassword
POST    change password   /api/v1/auth/changePassword
POST     get device token for (fcm integration for push notifications)     /api/v1/auth/getDeviceToken
DELETE    delete user data (me)    /api/v1/auth/deleteMe  
```

### User (Admin)
```
GET     get all users   /api/v1/auth/users?limit=5&page=1  (With pagination)
GET     get all user booking order     /api/v1/auth/users/bookingOrder
GET     get all contact us   /api/v1/auth/contactUs
POST    contact us   /api/v1/auth/contactUs (this endpoint specific user not admin)
PATCH     change password admin   /api/v1/auth/admin/changePassword
DELETE      delete user    /api/v1/auth/users/648de33ecb6d7f2f23bf19eb
DELETE      delete contact us    /api/v1/auth/contactUs/64983c7764ccb68fdd56d108 
```

### Booking Daily
```
POST    add booking daily    /api/v1/bookingDaily   
GET      get all booking daily completed or not     /api/v1/bookingDaily?completed=true
GET      search by day in booking daily      /api/v1/bookingDaily/search?start=2000/02/01&end=2000/02/05&completed=true
GET      search by name in booking daily    /api/v1/bookingDaily/search?name=Mahmo&completed=true
PATCH     Completed Booking Daily     /api/v1/bookingDaily/648eccaea05569ee4b056626
```

### Booking Monthly
```
POST    add booking monthly    /api/v1/bookingMonthly   
GET      get all booking monthly completed or not     /api/v1/bookingMonthly?completed=false
GET      search by name in booking monthly    /api/v1/bookingMonthly/search?name= Mahmoud &completed=false
```

### Booking Yearly
```
POST    add booking yearly    /api/v1/bookingYearly   
GET      get all booking yearly completed or not     /api/v1/bookingYearly?completed=false
GET      search by name in booking yearly    /api/v1/bookingYearly/search?name= Mahmoud h&completed=false
```

### Booking Special
```
POST    add booking special    /api/v1/bookingSpecial   
GET      get all booking special completed or not     /api/v1/bookingSpecial?completed=false
GET      search by name in booking special    /api/v1/bookingSpecial/search?name= Mahmoud h&completed=true
```

## :man: Project Created & Maintained By -

- **Hey guys, I'm Jayvardhan. Find out more about me** [ here](https://www.linkedin.com/in/mahmoud-hamdi-62bb1223b)
- **Reach out to me at** [mahmoud.backend.dev@gmail.com](mahmoud.backend.dev@gmail.com)

<h3 align="right">Built with :heart: by Mahmoud Hamdi</h3>
