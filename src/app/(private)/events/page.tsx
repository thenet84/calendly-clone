import { UserButton } from "@clerk/nextjs";
import { Fragment } from "react";

export default function EventsPage() {
    return (
        <Fragment>
            <h1>Events</h1>
            <UserButton />
        </Fragment>
    );
}