import { Test, TestingModule } from '@nestjs/testing';
import { CabeceraCarritoController } from './cabecera-carrito.controller';

describe('CabeceraCarrito Controller', () => {
  let controller: CabeceraCarritoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CabeceraCarritoController],
    }).compile();

    controller = module.get<CabeceraCarritoController>(CabeceraCarritoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
