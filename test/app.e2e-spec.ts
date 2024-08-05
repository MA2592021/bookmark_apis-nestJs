import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { CreateBookmarkDto } from 'src/bookmarks/dto/bookmark.dto';
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.init();
    app.listen(3333);
    prisma = app.get(PrismaService);
    prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
    app.close();
  });
  function getRandomNumber(min = 0, max = 1000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const dto: CreateUserDto = {
    email: 'amirsaid@gmail.com',
    name: 'amir said',
    password: '@Mir1234',
    age: 24,
  };
  const createUserData: CreateUserDto = {
    email: `test${getRandomNumber()}@gmail.com`,
    name: 'amir test',
    password: '@Mir1234',
    age: 24,
  };
  const createBookMarkData: CreateBookmarkDto = {
    title: 'test',
    link: 'www.google.com',
    desc: 'the best in the west',
  };
  describe('Auth', () => {
    describe('signUp', () => {
      it('should signUp', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
        // .inspect();
      });
    });

    describe('signin', () => {
      it('should signIn', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: dto.email, password: dto.password })
          .stores('userToken', 'access_token')
          .expectStatus(200);
        // .inspect();
      });
    });
  });

  describe('users', () => {
    describe('getMe', () => {
      it('should get user', () => {
        return pactum
          .spec()
          .get('/users/getme')
          .withBearerToken('$S{userToken}')
          .expectStatus(200);
      });
    });
    describe('create user', () => {
      it('should create user', () => {
        return pactum
          .spec()
          .post('/users')
          .withBody(createUserData)
          .withBearerToken('$S{userToken}')
          .stores('userId', 'id')
          .expectStatus(201);
        // .inspect();
      });
    });

    describe('edit user', () => {
      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/users/$S{userId}')
          .withBody({ name: dto.name + 'ss', age: 25 })
          .withBearerToken('$S{userToken}')
          .expectStatus(200);
        // .inspect();
      });
    });
    describe('delete user', () => {
      it('should delete user', () => {
        return pactum
          .spec()
          .delete('/users/$S{userId}')
          .withBearerToken('$S{userToken}')
          .expectStatus(200);
        // .inspect();
      });
    });
    describe('edit Current user', () => {
      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withBody({ name: dto.name + 'ss', age: 25 })
          .withBearerToken('$S{userToken}')
          .expectStatus(200);
        // .inspect();
      });
    });
    // describe('delete current user', () => {
    //   it('should delete user', () => {
    //     return pactum
    //       .spec()
    //       .delete('/users')
    //       .withBearerToken('$S{userToken}')
    //       .expectStatus(200);
    //     // .inspect();
    //   });
    // });
  });

  describe('bookmarks', () => {
    describe('create user for bookmark tests', () => {
      it('should create user', () => {
        return pactum
          .spec()
          .post('/users')
          .withBody(createUserData)
          .withBearerToken('$S{userToken}')
          .stores('userId', 'id')
          .expectStatus(201);
        // .inspect();
      });
    });

    describe('create bookmarks', () => {
      it('should create bookmark for loggedin user', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withBody(createBookMarkData)
          .withBearerToken('$S{userToken}')
          .expectStatus(201)
          .inspect();
      });
      it('should create bookmark for created user', () => {
        return pactum
          .spec()
          .post('/bookmarks/$S{userId}')
          .withBody(createBookMarkData)
          .withBearerToken('$S{userToken}')
          .stores('bookmarkId', 'id')
          .expectStatus(201);
        // .inspect();
      });
    });

    describe('get bookmark', () => {
      it('should get all bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks/')
          .withBearerToken('$S{userToken}')
          .expectStatus(200);
        // .inspect();
      });

      it('should get all bookmarks for created user', () => {
        return pactum
          .spec()
          .get('/bookmarks/user/$S{userId}')
          .withBearerToken('$S{userToken}')
          .expectStatus(200);
        // .inspect();
      });
      it('should get all bookmarks for current user', () => {
        return pactum
          .spec()
          .get('/bookmarks/user')
          .withBearerToken('$S{userToken}')
          .expectStatus(200);
        // .inspect();
      });
    });

    describe('edit bookmark', () => {
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/$S{bookmarkId}')
          .withBody({
            title: createBookMarkData.title + 'ss',
          })
          .withBearerToken('$S{userToken}')
          .expectStatus(200);
        // .inspect();
      });
    });
    describe('delete bookmark', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/$S{bookmarkId}')
          .withBearerToken('$S{userToken}')
          .expectStatus(200);
        // .inspect();
      });
      it('should delete all bookmarks for loggedin user', () => {
        return pactum
          .spec()
          .delete('/bookmarks/user')
          .withBearerToken('$S{userToken}')
          .expectStatus(200);
        // .inspect();
      });
    });
    describe('delete created user ', () => {
      it('should delete user with all his bookmarks', () => {
        return pactum
          .spec()
          .delete('/users/$S{userId}')
          .withBearerToken('$S{userToken}')
          .expectStatus(200);
        // .inspect();
      });
    });
  });

  it.todo('should Pass');
});
