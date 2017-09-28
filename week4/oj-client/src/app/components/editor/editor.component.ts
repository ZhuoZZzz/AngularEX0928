import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CollaborationService } from '../../services/collaboration.service';

declare const ace: any;
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  editor: any;
  languages: string[] = ['Java', 'Python'];
  language: string = 'Java';
  sessionID: string;
  output: string = '';
  defaultContent={
    'Java':`public class Example{
    public static void main(String[] args){
      //Type your Java code here
      }
    }`,
    'Python': `class Solution:
    def example():
      #Write your Python code here`
  };
  constructor(private collaboration: CollaborationService, 
              private route: ActivatedRoute,
              @Inject('data') private data) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionID = params['id'];
      this.initEditor();
    });
  }

  initEditor(): void {
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/eclipse');
    // this.editor.getSession().setMode('ace/mode/java');
    // this.editor.setValue(this.defaultContent['Java']);
    this.resetEditor();

    document.getElementsByTagName('textarea')[0].focus();

    this.collaboration.init(this.editor, this.sessionID);
    this.editor.lastAppliedChange = null;
    // register change callback
    this.editor.on('change', e => {
      console.log('editor changed:' + JSON.stringify(e));
      if (this.editor.lastAppliedChange != e) {
        this.collaboration.change(JSON.stringify(e));
      }
    });

    //cursor movement
    this.editor.getSession().getSelection().on('changeCursor', () =>{
      const cursor = this.editor.getSession().getSelection().getCursor();
      console.log('cursor move', JSON.stringify(cursor));
      this.collaboration.cursorMove(JSON.stringify(cursor));
    });

    this.collaboration.restoreBuffer();
  };

  setLanguage(language: string): void{
    this.language = language;
    this.resetEditor();
  }

  resetEditor(): void{
    console.log('Reseting editor...');
    this.editor.getSession().setMode(`ace/mode/${this.language.toLowerCase()}`);
    this.editor.setValue(this.defaultContent[this.language]);
    this.output = '';
  }

  submit(){
    this.output = '';
    //TODO
    const userCodes = this.editor.getValue();
    // console.log(userCodes);
    const codes = {
      userCodes: userCodes,
      lang: this.language.toLocaleLowerCase()
    };
    this.data.buildAndRun(codes)
      .then(res => this.output = res.text);
  }

}
