# NestJS


## Modules
Todas las aplicaciones de NestJS tiene por lo menos un module.
Los modules son encargados de organizar tus aplicaciones y sus dependencias, una aplicación real va a tener diferentes módulos.
Se recomienda utilizarlos para organizar tus componentes; tendrás diferentes modulos, cada uno encapsulado por la funcionalidad relacionada.

- Organización
Los módulos Products, Users y Sales estarán relacionados con el App Module, y se puede crear otro module como Image, encargada de subida y carga de imágenes, la cual estará relacionada con Products y Users. Cada uno encapsulando las funcionalidades, como Products de productos.

- Crear Module
Para generar un module con NestJS CLI:
nest generate module nombre_module
nest g mo nombre_module

Ejemplo: 
```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Decorador
@Module({
  // Imports de otros modules
  imports: [],
  controllers: [AppController],
  providers: [AppService],
  // exports, para exportar el module para reutilizarlo.
})
export class AppModule {}

```

## Controllers
En el modelo MVC con express, el router era el encargado de manejar las peticiones HTTP, pero en Nest, no hay un router como tal.
El controller se encarga de manejar las peticiones HTTP y de entregar una respuesta. Se registran en la propiedad controllers del decorador @Module.

- Decoradores
  - A nivel de clase como @Controller y toman como parámetro la URL para las peticiones HTTP.
  - A nivel de método como @Get, @Post, @Put, @Delete.

- Crear :
  - nest generate controller nombre_controller
  - nest g co nombre_controller
  
Ejemplo: 
```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api') // Decorador a nivel de clase, parametros para indicar la URL.
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // Decorador a nivel de método
  getHello(): string { // Método relacionado al decorador
    return this.appService.getHello(); // Llamada al método del service
  }
  
}

```

##  Providers
La mayoría de clases en Nest serán providers, incluyendo services, factories, helpers.
La principal idea de un provider es que pueda ser inyectado vía inyección de dependencias en ese módulo o en otros.
Se colocan en la propiedad providers de @Module y son instanciados automáticamente porque tienen @Injectable.
Se puede hacer disponible a otros módulos en la propiedad exports de @Module

Se debe agregar en el constructor del controller para poder acceder a sus métodos.
`  constructor(private readonly appService: AppService) {} `
Y utilizarlo con ``this.appService.getHelloWorld()``

## Services
Son los responsables de almacenar y obtener datos de tu base de datos.
Si utilizas TypeORM, un servicio se conecta a tu base de datos por medio de un repositorio que tendrá todos los métodos del ORM.
Se registran en la propiedad providers del decorador @Module

- Crear :
  - nest generate provider nombre_provider
  - nest g pr nombre_provider

Ejemplo:

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

```

## Inyección de dependencias
Conforme vas añadiendo archivos a tu aplicación, Nest se encarga de registrarlos en el lugar adecuado; mediante la inyección de dependencias.
Es un patrón de diseño que permite gestionar las dependencias de un objeto de manera externa, en lugar de que el propio objeto las cree.

Ejemplo:
Sin inyección de dependencias
```ts
class Database{
  connect(){
    console.log('Connected to the database')
  }
}

clas UserService{
  constructor(){
    this.database = new Database();
  }
}
```

Con inyección de dependencias:
```ts
class Database{
  connect(){
    console.log("Connected to the database")
  }
}

class UserService{
  constructor(database){
    this.database = database
  }
}

const myDatabase = new Database();
const userService = new UserService(myDatabase)
```

- Beneficios
  - Desacoplamiento: Los componentes son menos dependientes por lo tanto es más fácil su mantenimiento.
  - Facilidad de prueba: Al separar la creación de dependencias es más fácil probar cada uno de los componentes de forma individual.
  - SOLID, se aplica: 
    - El Principio de Responsabilidad Única (Single responsability Principle). 
    - El Principio de Inversion de Dependencias (Dependency Inversion Principle).

## Decoradores
Son una forma de añadir funcionalidades adicionales a clases, métodos, propiedades o parámetros sin modificar su código original, permiten crear estructuras más limpias y legibles.
Se utlizan para aplicar patrones de diseño que permiten modificar o extender el comportamiento de los elementos decorados.
En Nest se identifican con un @ al inicio.

Tipo de decoradores en Nest:
- Decoradores de Clase.
  - @Module, @Controller.
- Decoradores de Método.
  - @Get, @Post, @Delete, @Put.
- Decoradores de Parámetro.
  - @Param, @Query, @Body
- Decoradores de Propiedad.
  - @Injectablem @InjectRespository

## DTO ( Data Transfer Object ) 
Es un objeto que se utiliza para transferir datos entre diferentes partes de una aplicación, especialmente entre la capa de presentación (como controladores) y la capa de lógica de negocio (como servicios).
Los DTOs son útiles para definir la forma y estructura de los datos que se espera recibir o enviar, asegurando que se cumplan ciertas reglas y tipos.

**Caracteristicas**:
- Aplicación de validaciones.
- Tipado, permiten definir los tipos de datos.
- Separación de responsabilidades, ayuda a seperar la lógica de la aplicación de la estructura de datos.

Si declaramos el tipo de dato a recibir o enviar, solamente servirá para autocompletado, no valida o devuelve error si se ingresa otro dato.
Si se envia un dato de más, lo recibe de igual forma. 

```ts
export class CreateCategoryDto {
  name: string;
}

```

Si se quiere que se cumpla de forma estricta las validaciones se debe: 
- Instalar las dependencias `npm i class-validator class-transformer`

- En el main.ts se debe declarar el pipe, para que si se envia un dato de más no defino, no lo reciba.
````ts
 app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
```

````ts
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString() // Decorador de validación
  name: string;
}

````

Si no se envía "name" en la request, devolverá en la response:
```json
{
    "message": [
        "name must be a string"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

# TypeORM

TypeORM es un ORM que puede ser utilizado con TypeScript o Javascript. Funciona con NodeJS, Cordova, Ionic, React Native, etc.
- Soporta los patrones Active Record y Data Mapper.
- Soporta Entidades (Tablas y Columnas) así como tipos de datos exclusivos de bases de datos.
- Asociaciones, Repositorios, Eager y Lazy, Loading, Transacciones, Indices, Múltiples Bases de Datos.
- Soporta MySQL, MariaDB, Postgres, CockroachDB, Oracle, MongoDB, SQlite y SQL Server.

## Instalación de TypeORM

- Instalar las dependencias de typeorm `npm i @nestjs/typorm typeorm ps`
- Instalar la dependencia para usar variables de entorno `npm i @nestjs/config`

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  // Agregar el ConfigModule.forRoot para activar las variables de entorno en todo el proyecto.
  // ConfigModule.forFeature sirve para activar solamente en el modulo que se requiera.
  // IsGlobal, para que se pueda acceder en cualquier sitio de la aplicación.
  imports: [ConfigModule.forRoot({isGlobal: true}), CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

- Crear la carpeta config y el archivo typeorm.config.ts


```ts
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
});
```

- Agregar el TypeOrmModule.forRootAsync
```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      // useFactory porque typeOrmConfig no es un module
      useFactory: typeOrmConfig,
      // Inject de ConfigService, posibilitandonos acceder a las variables de entorno en typeOrmConfig
      inject: [ConfigService],
    }),
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

- Agregar los datos para la conexión a la base de datos, que nos trae configService (variables de entorno)

```ts
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  // Variables de entorno
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: configService.get('DATABASE_PORT'),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASS'),
  database: configService.get('DATABASE_NAME'),
  ssl: true,
  logging: true,
});
```

- Importar la entidad en su module
```ts

import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
```

- Injectar el repository de Category en el Category Service, para poder utilizar los métodos de Typeorm y realizar las consultas a la DB 
```ts
  
  export class CategoriesService {
    constructor(
      @InjectRepository(Category)
      private readonly categoryRepository: Repository<Category>,
    ) {}
  }

```

- Utilizar algún metodo del repository para interactuar con la DB, en este caso save, para crear un registro.
```ts
create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.save(createCategoryDto);
}
```

## Entidades
Es una clase que se mapea con una tabla de tu base de datos.
En estas podrás definir la estructura de tus tablas y columnas en la base de datos con su tipo de dato.
Usa el decorador @Entity

## Pipes 
En NestJS, los pipes osn componentes que permiten transformar y validar datos en las solicitudes entrantes. Funcionan como intermediarios que procesan los datos antes de que lleguen al controlador, asegurando que estén en el formato adecuado y que cumplan con las reglas de validación definidas.

**Tipos**
- Transformación: Pueden transformar el valor de entrada. Por ejemplo, convertir un string a un número.
- Validación: Verifican si el valor de entrada cumple con ciertas reglas. Por ejemplo, comprobar si un parámetro es un entero o si un campo es obligatorio.
Tambíen se pueden crear tus propios pipes.

Algunos pipes nativos de Nest son: 
- ValidationPipe
- ParseIntPipe
- ParseFloatPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- ParseEnumPipe
- DefaultValuePipe
- ParseFilePipe
- ParseDatePipe

Para activar el uso de pipes hay que incluirlo en el main.ts
```ts
 app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
```
¿Cómo implementar un pipe? 

Este pipe válida que el ID sea un entero, sino devuelve error.
```ts
@Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => new BadRequestException('ID no válido'),
      }),
    )
    id: string,
  ) {
    return this.categoriesService.findOne(+id);
  }
```

Este mismo pipe se utilizaría en cada endpoint donde se reciba el id por params, como en editar, eliminar, etc.
Así que convendría crear nuestro propio pipe.

- `nest g pi IdValidation common/pipes`

- Modificamos el código del pipe generado
```ts
import { BadRequestException, Injectable, ParseIntPipe } from '@nestjs/common';

@Injectable()
// Extendemos de la clase ParseIntPipe
export class IdValidationPipe extends ParseIntPipe {
  constructor() {
    // Modificamos el método exceptionFactory de ParseIntPipe con la excepción que querramos devolver
    super({
      exceptionFactory: () => new BadRequestException('ID no válido'),
    });
  }
}

```

- La añadimos al controller
```ts
@Get(':id')
  findOne(
    @Param('id', IdValidationPipe)
    id: string,
  ) {
    return this.categoriesService.findOne(+id);
  }
```
