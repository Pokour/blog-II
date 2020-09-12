import { Component, OnInit } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  swiper

  describe = false;
  roleDescription = ["You are our favourite people. If you are here to learn and access our free library, then giddy up, sign up and choose your role to be a Student.",
    "If you are not a student anymore, but a learner and doer in life, then sign up and choose your role to be a Collaborator. You will get to work on our ongoing projects and will also have access to our library.",
    "If your are here to check on how your students are doing, and how our platform can benefit you and your students, then do sign up and we shall get back to you as soon as we can."
  ];


  constructor() { }

  ngOnInit() {
    this.swiper = new Swiper('.blog-slider', {
      spaceBetween: 30,
      effect: 'fade',
      loop: true,
      autoplay: {
        delay: 2000
      },
      mousewheel: {
        invert: false
      },
      // autoHeight: true,
      pagination: {
        el: '.blog-slider__pagination',
        clickable: true
      }
    });
  }

}
