import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@Controller('transactions')
export class TransferController {
  constructor(private readonly transferService: TransferService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTransferDto: CreateTransferDto, @Req() req) {
    return this.transferService.create(createTransferDto, req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.transferService.findAll(req.user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req) {
    return this.transferService.findOne(+id, req.user.sub);
  }
}
