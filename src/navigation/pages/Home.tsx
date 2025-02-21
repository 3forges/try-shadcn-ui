import { JSX } from "preact/jsx-runtime";

export default function Home(props: any): JSX.Element {
    return (
      <>
        <h2>{props.path}</h2>
      </>
    )
  }