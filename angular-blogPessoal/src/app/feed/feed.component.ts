import { Component, OnInit } from '@angular/core';
import { Postagem } from '../model/Postagem';
import { Tema } from '../model/Tema';
import { PostagemService } from '../service/postagem.service';
import { TemaService } from '../service/tema.service';
import { AlertasService } from '../service/alertas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})

export class FeedComponent implements OnInit {

  key = 'data'
  reverse = true

  postagem: Postagem = new Postagem()
  listaPostagens: Postagem[]
  titulo: string

  tema: Tema = new Tema()
  listaTemas: Tema[]
  idTema: number
  nomeTema: string

  constructor(
    private postagemService: PostagemService,
    private temaService: TemaService,
    private alert: AlertasService,
    private router: Router
  ) { }

  ngOnInit() {
    let token = localStorage.getItem('token')

    if (token == null) {
      this.router.navigate(['/login'])
      this.alert.showAlertDanger('Faça login para continuar.')
    }

    window.scroll(0, 0)

    this.findAllPostagens()
    this.findAllTemas()
  }

  findAllPostagens() {
    this.postagemService.getAllPostagens().subscribe((resp: Postagem[]) => {
      this.listaPostagens = resp
      console.log(this.listaPostagens)
    })
  }

  publicar() {
    this.tema.id = this.idTema
    this.postagem.tema = this.tema

    if (this.postagem.titulo == null || this.postagem.texto == null || this.postagem.tema == null) {
      this.alert.showAlertDanger('Preencha todos os campos para fazer uma publicação.')
    } 
    else { 
      this.postagemService.postPostagem(this.postagem).subscribe((resp: Postagem) => { 
        this.postagem = resp
        console.log(this.postagem)
        this.postagem = new Postagem()
        this.alert.showAlertSuccess('Postagem realizada com sucesso!')
        this.findAllPostagens()
      })
    }
  }

  findAllTemas() {
    this.temaService.getAllTemas().subscribe((resp: Tema[]) => {
      this.listaTemas = resp
    })
  }

  findByIdTema() {
    this.temaService.getByIdTema(this.idTema).subscribe((resp: Tema) => {
      this.tema = resp;
    })
  }

  findByTituloPostagem() {
    if (this.titulo == null) {
      this.findAllPostagens
    } else {
      this.postagemService.getByTituloPostagem(this.titulo).subscribe((resp: Postagem[]) => {
        this.listaPostagens = resp
      } )
    }
  }

  findbyNomeTema() {
    if (this.nomeTema == null) {
      this.findAllTemas
    } else {
      this.temaService.getByNomeTema(this.nomeTema).subscribe((resp: Tema[]) => {
        this.listaTemas = resp 
      })
    }
  }
}