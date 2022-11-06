interface S<T extends N> { _: T };

type N = 0 | S<N>;

type Eq<N1 extends N, N2 extends N> = 
  [N1, N2] extends [0, 0] ? true :
  [N1, N2] extends [0, S<infer _>] ? false :
  [N1, N2] extends [S<infer _>, 0] ? false :
  [N1, N2] extends [S<infer PN1>, S<infer PN2>] ? Eq<PN1, PN2> : 
  never;

type Addition<N1 extends N, N2 extends N> = 
  N2 extends 0 ? N1 : 
  N2 extends S<infer N3> ? S<Addition<N1, N3>> : 
  never;

type Multiplication<N1 extends N, N2 extends N> = 
  N2 extends 0 ? 0 : 
  N2 extends S<infer N3> ? 
    // Same as Addition<N1, Multiplication<N1, N3>>, 
    // but doesn't trigger a TS error (probably thanks to tail call elimination)
    Multiplication<N1, N3> extends infer Prod extends N ? 
      Addition<N1, Prod> :
    never : 
  never;

type LTE<N1 extends N, N2 extends N> = 
  N1 extends 0 ? true : 
  N2 extends 0 ? false : 
  [N1, N2] extends [S<infer PN1>, S<infer PN2>] ? LTE<PN1, PN2> : 
  never;

type LT<N1 extends N, N2 extends N> = 
  [N1, N2] extends [0, 0] ? false :
  [N1, N2] extends [0, S<infer _>] ? true :
  [N1, N2] extends [S<infer _>, 0] ? false :
  [N1, N2] extends [S<infer PN1>, S<infer PN2>] ? LT<PN1, PN2> : 
  never;

type Fib<X extends N> =
  X extends 0 ? 0 :
  X extends S<0> ? S<0> :
  X extends S<infer P1> ? 
    P1 extends S<infer P2> ? 
      // Same as with multiplication. In fact, this could be seen 
      // as a variable declaration and assignment: 
      // Expr extends infer Var extends T -> let Var: T = Expr
      Fib<P1> extends infer F1 extends N ? 
        Fib<P2> extends infer F2 extends N ? 
          Addition<F1, F2> : 
        never : 
      never :
    never :
  never

type FibOpt<X extends N> =
  X extends 0 ? 0 :
  X extends S<0> ? S<0> :
  FibOptRec<X, S<S<0>>, S<0>, 0>

type FibOptRec<Max extends N, I extends N, Prev1 extends N, Prev2 extends N> =
  I extends Max ? Addition<Prev1, Prev2> :
  FibOptRec<Max, S<I>, Addition<Prev1, Prev2>, Prev1>

type ShouldBeTrue1 = Eq<Addition<S<S<S<0>>>, Addition<S<0>, S<S<0>>>>, S<S<S<S<S<S<0>>>>>>>;
type ShouldBeTrue2 = Eq<Multiplication<S<S<0>>, S<S<0>>>, Addition<S<S<0>>, S<S<0>>>>;
type ShouldBeFalse = LTE<Multiplication<S<S<0>>, S<S<0>>>, Addition<S<S<0>>, S<0>>>;
type ShouldBeTrue3 = Eq<Fib<S<S<S<S<S<S<0>>>>>>>, FibOpt<S<S<S<S<S<S<0>>>>>>>>;

const x1: ShouldBeTrue1 = false;
const x2: ShouldBeTrue2 = false;
const x3: ShouldBeTrue3 = false;
const x4: ShouldBeFalse = true;