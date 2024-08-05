import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { CreateUserDto } from 'src/users/dto/user.dto';
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
    const createUserData: CreateUserDto = {
      email: `test${getRandomNumber()}@gmail.com`,
      name: 'amir test',
      password: '@Mir1234',
      age: 24,
    };
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
          .expectStatus(200)
          .inspect();
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
    describe('delete current user', () => {
      it('should delete user', () => {
        return pactum
          .spec()
          .delete('/users')
          .withBearerToken('$S{userToken}')
          .expectStatus(200)
          .inspect();
      });
    });
  });

  describe('bookmarks', () => {});

  it.todo('should Pass');
});
