
interface MyInt{
    name: string;
}

export class Test {

    constructor(file?: MyInt) {

        this.greet();
        
        if (!file) {
            console.log('no param');
        } else {
            console.log('param');
        }
    }

    greet(){
        console.log('hello there')
    }

}

const app = new Test({name: 'ashkas'});

